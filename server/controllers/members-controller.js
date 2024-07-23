import e from 'express';

import { ReadOneFromMembers, ReadMembers, UpdateMembers, CreateMembers, RemoveMembers, } from './../databaseControllers/members-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
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
        EntityId = Discussion[0].DocId;
        if (Discussion[0].Privacy === "Private") {
            return res.status(444).json(AlertBoxObject("Cannot Join Private Discussion", "You cannot join a private discussion"));
        }
    }
    const UserDetails = await ReadOneFromUsers(UserId);
    req.body = { ...MemberInit(req.body), MemberId: UserId,EntityId,  UserDetails };
    await CreateMembers(req.body);
    return res.json(true);
}

const InviteMembers = async (req, res) => { 
    const { UserId } = req.user;
    const { EntityId } = req.params;
    const Member = await ReadMembers({ MemberId: UserId ,EntityId}, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You are not a member of this discussion"));
    }
    if (!Member[0].Permissions.CanInviteOthers) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You cannot invite others to this discussion"));
    }


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
        Permissions: PermissionObjectInit()
    }
}
const PermissionObjectInit = () => {
    return {
        IsAdmin: false,
        CanInviteOthers: false,
        CanPostActivity: false,
        CanUploadPhoto: false,
        CanCreateAlbum: false,
        CanUploadVideo: false
    }
}

export {
    GetOneFromMembers, GetMembers, PostMembers, PatchMembers, DeleteMembers,
    PermissionObjectInit
}