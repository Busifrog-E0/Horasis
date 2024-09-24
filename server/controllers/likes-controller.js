import e from 'express';

import { ReadOneFromLikes, ReadLikes, UpdateLikes, CreateLikes, RemoveLikes, } from './../databaseControllers/likes-databaseController.js';
import { IncrementActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { IncrementComments } from '../databaseControllers/comments-databaseController.js';
import { RemoveNotificationForActivityLikes, SendNotificationsforActivityLikes } from './notifications-controller.js';
import { IncrementArticles } from '../databaseControllers/articles-databaseController.js';
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
    const { EntityId } = req.params;
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.EntityId = EntityId;
    //@ts-ignore
    const Likes = await ReadLikes(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Likes.map(async Like => {
        const UserDetails = await ReadOneFromUsers(Like.UserId);
        return { ...Like, UserDetails };
    }));
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostLikes = async (req, res) => {
    const { EntityId: entityId } = req.body;
    const EntityId = entityId || req.params.EntityId;
    //@ts-ignore
    const { UserId } = req.user;
    const CheckLike = await ReadLikes({ EntityId, UserId }, undefined, 1, undefined);
    if (CheckLike.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Like", "You cannot like twice"));
    }
    const data = { EntityId, UserId, Type: req.body.Type };
    await CreateLikes(data);
    if (data.Type === 'Activity') {
        await IncrementActivities({ NoOfLikes: 1 }, data.EntityId);
        await SendNotificationsforActivityLikes(UserId, EntityId);
    }
    if (data.Type === 'Comment') {
        await IncrementComments({ NoOfLikes: 1 }, data.EntityId);
    }
    if (data.Type === 'Article') {
        await IncrementArticles({ NoOfLikes: 1 }, data.EntityId);
    }
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
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const CheckLike = await ReadLikes({ EntityId, UserId }, undefined, 1, undefined);
    if (CheckLike.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot DisLike", "You have not liked this activity"));
    }
    const [Like] = CheckLike;
    await RemoveLikes(Like.DocId);
    await RemoveNotificationForActivityLikes(EntityId);
    if (Like.Type === 'Activity') {
        await IncrementActivities({ NoOfLikes: -1 }, Like.EntityId);
    }
    if (Like.Type === 'Comment') {
        await IncrementComments({ NoOfLikes: -1 }, Like.EntityId);
    }
    if (Like.Type === 'Article') {
        await IncrementArticles({ NoOfLikes: -1 }, Like.EntityId);
    }
    return res.json(true);
}


export {
    GetOneFromLikes, GetLikes, PostLikes, PatchLikes, DeleteLikes
}