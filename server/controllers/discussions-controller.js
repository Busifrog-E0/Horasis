import e from 'express';

import { ReadOneFromDiscussions, ReadDiscussions, UpdateDiscussions, CreateDiscussions, RemoveDiscussions, } from './../databaseControllers/discussions-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers } from '../databaseControllers/members-databaseController.js';
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
    const { DiscussionId } = req.params;
    const data = await ReadOneFromDiscussions(DiscussionId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<DiscussionData>>>}
 */
const GetDiscussions = async (req, res) => {
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["DiscussionName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const Discussions = await ReadDiscussions(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Discussions.map(async Discussion => { }))
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
    const Permissions = PermissionObjectInit();
    Permissions.IsAdmin = true
    const DiscussionId = await CreateDiscussions({ ...req.body, UserDetails });
    await CreateMembers({ MemberId: OrganiserId,EntityId : DiscussionId , UserDetails,Permissions})
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