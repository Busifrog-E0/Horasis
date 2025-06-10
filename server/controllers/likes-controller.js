import e from 'express';

import { ReadOneFromLikes, ReadLikes, UpdateLikes, CreateLikes, RemoveLikes, TransactionalReadLikes, } from './../databaseControllers/likes-databaseController.js';
import { IncrementActivities, ReadOneFromActivities, TransactionalIncrementActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers, TransactionalReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject, GetParentTypeFromEntity, TransactionalGetParentTypeFromEntity } from './common.js';
import { IncrementComments, ReadOneFromComments, TransactionalIncrementComments } from '../databaseControllers/comments-databaseController.js';
import { RemoveNotificationForActivityLikes, SendNotificationsforActivityLikes, TransactionalSendNotificationToUser } from './notifications-controller.js';
import { IncrementArticles, TransactionalIncrementArticles } from '../databaseControllers/articles-databaseController.js';
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
    const Session = databaseHandling.dbClient.startSession();
    const { EntityId: entityId } = req.body;
    const EntityId = entityId || req.params.EntityId;
    //@ts-ignore
    const { UserId } = req.user;
    try {
        Session.startTransaction();
        const CheckLike = await TransactionalReadLikes({ EntityId, UserId }, undefined, 1, undefined, Session);
        if (CheckLike.length > 0) {
            await Session.commitTransaction();
            return res.status(444).json(AlertBoxObject("Cannot Like", "You cannot like twice"));
        }

        const UserDetails = await TransactionalReadOneFromUsers(UserId, true, Session);
        const { Type } = req.body;
        const { ParentId, ParentType } = await TransactionalGetParentTypeFromEntity(EntityId, Type, Session);
        if (Type === 'Activity') {
            await TransactionalIncrementActivities({ NoOfLikes: 1 }, EntityId, Session);
            await TransactionalSendNotificationToUser(UserId, EntityId, Session);
        }
        if (Type === 'Comment') {
            await TransactionalIncrementComments({ NoOfLikes: 1 }, EntityId);
        }
        if (Type === 'Article') {
            await TransactionalIncrementArticles({ NoOfLikes: 1 }, EntityId);
        }
        const data = LikeInit({
            EntityId, UserId, Type: req.body.Type, UserDetails, ParentId,
            //@ts-ignore
            ParentType
        });
        await CreateLikes(data);
        return res.json(true);

    } catch (error) {
        await Session.abortTransaction();
        return res.status(500).json(error.message);
    }
    finally {
        await Session.endSession();
    }

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