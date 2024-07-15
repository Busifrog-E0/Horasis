import e from 'express';

import { ReadOneFromFollows, ReadFollows, UpdateFollows, CreateFollows, RemoveFollows, GetFollowCount, } from './../databaseControllers/follow-databaseController.js';
import { ViewOtherUserData } from './users-controller.js';
import { AlertBoxObject } from './common.js';
/**
 * @typedef {import('./../databaseControllers/follow-databaseController.js').FollowData} FollowData 
 */

/**
 * @typedef {import('../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<FollowData>>}
 */
const GetOneFromFollows = async (req, res) => {
    const { FollowId } = req.params;
    const data = await ReadOneFromFollows(FollowId);
    return res.json(data);
}

/**
 * 
 * @param {boolean} IsFollowers 
 * @returns 
 */
const GetFollows = (IsFollowers) => async (/** @type {e.Request} */ req, /** @type {e.Response} */ res) => {
    
    const { UserId } = req.params;
    let OtherUser = ""
    const { Filter, NextId, Limit, OrderBy } = req.query;
    if (IsFollowers) {
        //@ts-ignore
        Filter.FolloweeId = UserId;
        OtherUser = "FollowerId"
    }
    else {
        //@ts-ignore
        Filter.FollowerId = UserId;
        OtherUser = "FolloweeId"
    }
    //@ts-ignore
    const data = await ReadFollows(Filter, NextId, Limit, OrderBy);
    const Users = await Promise.all(data.map(Follow => {
        const OtherUserId = Follow[OtherUser];
        return ViewOtherUserData(UserId, OtherUserId);
    }));
    return res.json(Users);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetFollowNumber = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.params;
    const Followers = await GetFollowCount({ FolloweeId: UserId });
    const Followings = await GetFollowCount({ FollowerId: UserId });
    return res.json({
        NoOfFollowers: Followers,
        NoOfFollowings: Followings
    })
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostFollows = async (req, res) => {
    //@ts-ignore
    req.body.FollowerId = req.user.UserId;
    const { FollowerId, FolloweeId } = req.body;
    if (FolloweeId === FollowerId) {
        return res.status(444).json(AlertBoxObject("Cannot follow yourself","You cannot follow yourself"));
    }
    const Follow = await ReadFollows({ FolloweeId, FollowerId }, undefined, 1, undefined);
    if (Follow.length > 0) {
        return res.status(444).json(AlertBoxObject("Already follows this profile", "You already follow this profile"));
    }
    await CreateFollows(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchFollows = async (req, res) => {
    const { FollowId } = req.params;
    await UpdateFollows(req.body, FollowId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteFollows = async (req, res) => {
    const { FolloweeId, UserId } = req.params;
    //@ts-ignore
    const Follow = await ReadFollows({ FolloweeId, FollowerId: UserId }, undefined, 1, undefined);
    if (Follow.length == 0) {
        return res.status(444).json(AlertBoxObject("Not following this profile", "You are already not following this profile"));
    }
    await RemoveFollows(Follow[0].DocId);
    return res.json(true);
}



export {
    GetOneFromFollows, GetFollows, PostFollows, PatchFollows, DeleteFollows,
    GetFollowNumber
}