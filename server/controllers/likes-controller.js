import e from 'express';

import { ReadOneFromLikes, ReadLikes, UpdateLikes, CreateLikes, RemoveLikes, } from './../databaseControllers/likes-databaseController.js';
import { IncrementActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/likes-databaseController.js').LikeData} LikeData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<LikeData>>}
 */
const GetOneFromLikes = async (req, res) => {
    const { LikeId } = req.params;
    const data = await ReadOneFromLikes(LikeId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<LikeData>>>}
 */
const GetLikes = async (req, res) => {
    const { ActivityId } = req.params;
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.ActivityId = ActivityId;
    //@ts-ignore
    const data = await ReadLikes(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostLikes = async (req, res) => {
    const { ActivityId, UserId } = req.params;
    const UserDetails = await ReadOneFromUsers(UserId);
    const data = { ActivityId, UserId,UserDetails };
    await CreateLikes(data);
    await IncrementActivities({ NoOfLikes: 1 }, ActivityId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchLikes = async (req, res) => {
    const { LikeId } = req.params;
    await UpdateLikes(req.body, LikeId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteLikes = async (req, res) => {
    const { LikeId } = req.params;
    const Like = await ReadOneFromLikes(LikeId);
    await RemoveLikes(LikeId);
    await IncrementActivities({ NoOfLikes: -1 }, Like.ActivityId);
    return res.json(true);
}


export {
    GetOneFromLikes, GetLikes, PostLikes, PatchLikes, DeleteLikes
}