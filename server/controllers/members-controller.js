import e from 'express';

import { ReadOneFromMembers, ReadMembers, UpdateMembers, CreateMembers, RemoveMembers, UpdateManyMembers, } from './../databaseControllers/members-databaseController.js';
import { IncrementDiscussions, ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/members-databaseController.js').MemberData} MemberData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<MemberData>>}
 */
const GetOneFromMembers = async (req, res) => {
    const { MemberId } = req.params;
    const data = await ReadOneFromMembers(MemberId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<MemberData>>>}
 */
const GetMembers = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadMembers(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostMembers = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    let EntityId = ""
    if (req.params.DiscussionId) {
        const Discussion = await ReadOneFromDiscussions(req.params.DiscussionId);
        EntityId = Discussion.DocId;
        if (Discussion.Privacy === "Private") {
            return res.status(444).json(AlertBoxObject("Cannot Join Private Discussion", "You cannot join a private discussion"));
        }
    }
    const UserDetails = await ReadOneFromUsers(UserId);
    req.body = { ...MemberInit(req.body), MemberId: UserId,EntityId,  UserDetails };
    await CreateMembers(req.body);
    await IncrementDiscussions({ NoOfMembers: 1 }, EntityId);
    return res.json(true);
}

const InviteMembers = async (req, res) => { 
    const { UserId } = req.user;
    const { EntityId,InviteeId } = req.params;
    const Member = await ReadMembers({ MemberId: UserId ,EntityId}, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You are not a member of this discussion"));
    }
    if (!Member[0].Permissions.CanInviteOthers) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You cannot invite others to this discussion"));
    }
    const UserDetails = await ReadOneFromUsers(InviteeId);
    req.body = { ...MemberInit(req.body), MemberId: InviteeId, EntityId, UserDetails };
    req.body.Status = "Invited";
    await CreateMembers(req.body);
    return res.json(true);
}

const AcceptMemberInvitation = async (req, res) => {
    const { EntityId } = req.params;
    const { UserId } = req.user;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Accept", "You have not been invited to discussion"));
    }
    if (Member[0].Status === "Accepted") {
        return res.status(444).json(AlertBoxObject("Cannot Accept", "You have already joined this discussion"));
    }
    await UpdateMembers({ Status: "Accepted" }, Member[0].DocId);
    await IncrementDiscussions({ NoOfMembers: 1 }, EntityId);
    return res.json(true);
}
/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const UpdateMemberPermissions = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (!Member[0].Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Update Permissions", "You are not an admin of this discussion"));
    }
    await Promise.all(Object.keys(req.body).map(async (PermissionArray) => { 
        await UpdateManyMembers({ [PermissionArray] : true},{EntityId,MemberId : { $in : PermissionArray}})
    }))
    return res.json(true);

}
/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchMembers = async (req, res) => {
    const { MemberId } = req.params;
    await UpdateMembers(req.body, MemberId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteMembers = async (req, res) => {
    const { MemberId } = req.params;
    await RemoveMembers(MemberId);
    return res.json(true);
}


const MemberInit = (Member) => {
    return {
        ...Member,
        Status: "Accepted",
        Permissions: PermissionObjectInit(false)
    }
}
const PermissionObjectInit = (IsAdmin) => {
    return {
        IsAdmin: IsAdmin,
        CanInviteOthers: IsAdmin,
        CanPostActivity: IsAdmin,
        CanUploadPhoto: IsAdmin,
        CanCreateAlbum: IsAdmin,
        CanUploadVideo: IsAdmin
    }
}

export {
    GetOneFromMembers, GetMembers, PostMembers, PatchMembers, DeleteMembers,
    PermissionObjectInit,InviteMembers,AcceptMemberInvitation,UpdateMemberPermissions
}