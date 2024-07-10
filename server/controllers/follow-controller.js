import e from 'express';

import { ReadOneFromFollows, ReadFollows, UpdateFollows, CreateFollows, RemoveFollows, GetFollowCount, } from './../databaseControllers/follow-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
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
const GetFollows =  (IsFollowers) =>
    /**
     * @param {e.Request} req 
     * @param {e.Response} res 
     * @returns 
     */
    async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
        if (IsFollowers) {
            //@ts-ignore
            Filter.FolloweeId = req.user.UserId;
        }
        else {
            //@ts-ignore
            Filter.FollowerId = req.user.UserId;
        }
    //@ts-ignore
    const data = await ReadFollows(Filter, NextId, Limit, OrderBy);
    const promises = [];
    for (const follow of data) {
        promises.push(ReadOneFromUsers(follow.FollowerId))
    }
    const Follows = await Promise.all(promises)
    return res.json(Follows);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetFollowNumber = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const Followers = await GetFollowCount({ FolloweeId: UserId });
    const Followings = await GetFollowCount({ FollowerId: UserId });
    return res.json({
        NoOfFollowers: Followers,
        NoOfFollowings : Followings
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
        return res.status(444).json("Cannot follow yourself");
    }
    const Follow = await ReadFollows({ FolloweeId, FollowerId }, undefined, 1, undefined);
    if (Follow.length > 0) {
        return res.status(444).json("Alreadyy follows this profile");
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
    const { FolloweeId } = req.body;
    //@ts-ignore
    const FollowerId = req.user.UserId;
    const Follow = await ReadFollows({ FolloweeId, FollowerId }, undefined, 1, undefined);
    if (Follow.length == 0) {
        return res.json("Already not following this profile")
    }
    await RemoveFollows(Follow[0].DocId);
    return res.json(true);
}



export {
    GetOneFromFollows, GetFollows, PostFollows, PatchFollows, DeleteFollows,
    GetFollowNumber
}