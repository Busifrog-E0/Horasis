import e from 'express';

import databaseHandling from '../databaseControllers/functions.js';
import { ReadOneFromFollows, ReadFollows, UpdateFollows, CreateFollows, RemoveFollows, GetFollowCount, TransactionalReadFollows, TransactionalCreateFollows, } from './../databaseControllers/follow-databaseController.js';
import { AddConnectionstoUser, RemoveConnectionsToUser, ViewOtherUserData } from './users-controller.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { RemoveNotificationsForFollow, SendNotificationsForFollow } from './notifications-controller.js';
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
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter['UserDetails.DocId'] = UserId;
        //@ts-ignore
        Filter['$or'] = [
            { 'UserDetails.FullName': { $regex: Keyword, $options: 'i' } },
            { 'UserDetails.Username': { $regex: Keyword, $options: 'i' } },
        ]
    }
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
        return ViewOtherUserData(UserId, OtherUserId, Follow);
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
        return res.status(444).json(AlertBoxObject("Cannot follow yourself", "You cannot follow yourself"));
    }


    const Follow = await TransactionalReadFollows({ FolloweeId, FollowerId }, undefined, 1, undefined, undefined);
    if (Follow.length > 0) {
        return res.status(444).json(AlertBoxObject("Already follows this profile", "You already follow this profile"));
    }
    const UserDetails = await Promise.all([ReadOneFromUsers(FolloweeId), ReadOneFromUsers(FollowerId)]);
    req.body.UserDetails = UserDetails;
    const CheckFlag = await TransactionalCreateFollows(req.body, undefined, undefined);

    if (!CheckFlag) {
        return res.status(444).json(AlertBoxObject("Already follows this profile", "You already follow this profile"));
    }

    await SendNotificationsForFollow(FollowerId, FolloweeId);
    AddConnectionstoUser(FolloweeId, FollowerId);
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
    const { FolloweeId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    //@ts-ignore
    const Follow = await ReadFollows({ FolloweeId, FollowerId: UserId }, undefined, 1, undefined);
    if (Follow.length === 0) {
        return res.status(444).json(AlertBoxObject("Not following this profile", "You are already not following this profile"));
    }
    await RemoveNotificationsForFollow(UserId, FolloweeId);
    await RemoveFollows(Follow[0].DocId);
    RemoveConnectionsToUser(FolloweeId, UserId);
    return res.json(true);
}



export {
    GetOneFromFollows, GetFollows, PostFollows, PatchFollows, DeleteFollows,
    GetFollowNumber
}