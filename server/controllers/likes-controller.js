import e from 'express';

import { ReadOneFromLikes, ReadLikes, UpdateLikes, CreateLikes, RemoveLikes, TransactionalReadLikes, TransactionalCreateLikes, TransactionalRemoveLikes, } from './../databaseControllers/likes-databaseController.js';
import { IncrementActivities, ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject, GetParentTypeFromEntity } from './common.js';
import { IncrementComments, ReadOneFromComments } from '../databaseControllers/comments-databaseController.js';
import { RemoveNotificationForActivityLikes, SendNotificationsforActivityLikes } from './notifications-controller.js';
import { IncrementArticles } from '../databaseControllers/articles-databaseController.js';
import databaseHandling from '../databaseControllers/functions.js';

/**
 * @typedef {import('./../databaseControllers/likes-databaseController.js').LikeData} LikeData 
 */

/**
 * @typedef {import('../databaseControllers/users-databaseController.js').UserData} UserData
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
    const { EntityId: entityId, Type } = req.body;
    const EntityId = entityId || req.params.EntityId;
    //@ts-ignore
    const { UserId } = req.user;

    const CheckLike = await TransactionalReadLikes({ EntityId, UserId }, undefined, 1, undefined, undefined);
    if (CheckLike.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Like", "You cannot like twice"));
    }

    const UserDetails = await ReadOneFromUsers(UserId);
    const { ParentId, ParentType } = await GetParentTypeFromEntity(EntityId, Type);
    const data = LikeInit({
        EntityId, UserId, Type, UserDetails, ParentId,
        //@ts-ignore
        ParentType
    });
    const FlagCheck = await TransactionalCreateLikes(data, undefined, undefined);
    if (!FlagCheck) {
        return res.status(444).json(AlertBoxObject("Cannot Like", "You cannot like twice"));
    }


    if (Type === 'Activity') {
        await IncrementActivities({ NoOfLikes: 1 }, EntityId);
        await SendNotificationsforActivityLikes(UserId, EntityId);
    }
    if (Type === 'Comment') {
        await IncrementComments({ NoOfLikes: 1 }, EntityId);
    }
    if (Type === 'Article') {
        await IncrementArticles({ NoOfLikes: 1 }, EntityId);
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

    /**@type {LikeData} */
    //@ts-ignore
    let Like = {};
    let transactionFinish = false;
    const Session = databaseHandling.dbClient.startSession();

    try {
        Session.startTransaction();
        const CheckLike = await TransactionalReadLikes({ EntityId, UserId }, undefined, 1, undefined, Session);
        if (CheckLike.length === 0) {
            await Session.abortTransaction();
            return res.status(444).json(AlertBoxObject("Cannot DisLike", "You have not liked this activity"));
        }
        Like = CheckLike[0];
        await TransactionalRemoveLikes(Like.DocId, Session);
        transactionFinish = true;
        await Session.commitTransaction();
    } catch (error) {
        await Session.abortTransaction();
        transactionFinish = false;
    }
    finally {
        await Session.endSession();
    }

    if (!transactionFinish) {
        return res.status(444).json(AlertBoxObject("Cannot Like", "You cannot like twice"));
    }

    if (Like.Type === 'Activity') {
        await IncrementActivities({ NoOfLikes: -1 }, Like.EntityId);
        await RemoveNotificationForActivityLikes(EntityId);
    }
    if (Like.Type === 'Comment') {
        await IncrementComments({ NoOfLikes: -1 }, Like.EntityId);
    }
    if (Like.Type === 'Article') {
        await IncrementArticles({ NoOfLikes: -1 }, Like.EntityId);
    }
    return res.json(true);
}

/**
 * 
 * @param {object} Data
 * @param {'Activity'|'Comment'|'Article'} Data.Type
 * @param {string} Data.EntityId
 * @param {string} Data.UserId
 * @param {UserData} Data.UserDetails
 * @param {string} Data.ParentId
 * @param {'Activity'|'Article'|'Discussion'|'Event'|'Podcast'} Data.ParentType
 *  
 */
const LikeInit = (Data) => {
    return {
        ...Data
    }
}

export {
    GetOneFromLikes, GetLikes, PostLikes, PatchLikes, DeleteLikes
}