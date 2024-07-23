import e from 'express';

import { ReadOneFromDiscussions, ReadDiscussions, UpdateDiscussions, CreateDiscussions, RemoveDiscussions, } from './../databaseControllers/discussions-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { PermissionObjectInit } from './members-controller.js';
/**
 * @typedef {import('./../databaseControllers/discussions-databaseController.js').DiscussionData} DiscussionData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<DiscussionData>>}
 */
const GetOneFromDiscussions = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { DiscussionId } = req.params;
    const Discussion = await ReadOneFromDiscussions(DiscussionId);
    const DiscussionMemberObject = { IsMember: false, Permissions: {} };
    const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
    if (Member.length > 0) {
        DiscussionMemberObject.IsMember = true;
        DiscussionMemberObject.Permissions = Member[0].Permissions
        DiscussionMemberObject.Status = Member[0].Status
    }
    const data = { ...Discussion, ...DiscussionMemberObject };
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<DiscussionData>>>}
 */
const GetDiscussions = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["DiscussionName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const Discussions = await ReadDiscussions(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Discussions.map(async Discussion => {
        const DiscussionMemberObject = { IsMember: false, };
        const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
        if (Member.length > 0) {
            DiscussionMemberObject.IsMember = true;
            DiscussionMemberObject.Permissions = Member[0].Permissions
            DiscussionMemberObject.Status = Member[0].Status
        }
        return { ...Discussion, ...DiscussionMemberObject }
    }))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostDiscussions = async (req, res) => {
    const { OrganiserId } = req.body;
    const UserDetails = await ReadOneFromUsers(OrganiserId);
    const Permissions = PermissionObjectInit(true);
    const DiscussionId = await CreateDiscussions({ ...req.body, UserDetails });
    await CreateMembers({ MemberId: OrganiserId, EntityId: DiscussionId, UserDetails, Permissions })
    return res.json(DiscussionId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchDiscussions = async (req, res) => {
    const { DiscussionId } = req.params;
    await UpdateDiscussions(req.body, DiscussionId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteDiscussions = async (req, res) => {
    const { DiscussionId } = req.params;
    await RemoveDiscussions(DiscussionId);
    return res.json(true);
}



export {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions
}