import e from 'express';

import { ReadOneFromFollows, ReadFollows, UpdateFollows, CreateFollows, RemoveFollows, } from './../databaseControllers/follow-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/follow-databaseController.js').FollowData} FollowData 
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
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<FollowData>>>}
 */
const GetFollows = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadFollows(Filter, NextId, Limit, OrderBy);
    return res.json(data);
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
    GetOneFromFollows, GetFollows, PostFollows, PatchFollows, DeleteFollows
}