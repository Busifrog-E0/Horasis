import e from 'express';

import { ReadSaves, CreateSaves, RemoveSaves, } from './../databaseControllers/saves-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromArticles } from '../databaseControllers/articles-databaseController.js';
import { SetActivityDataForGet } from './activities-controller.js';
import { SetDiscussionDataForGet } from './discussions-controller.js';
import { SetArticleDataForGet } from './articles-controller.js';
/**
 * @typedef {import('./../databaseControllers/saves-databaseController.js').SaveData} SaveData 
 */



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetSaves = async (req, res) => {
    // @ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.UserId = req.user.UserId;
    //@ts-ignore
    const Saves = await ReadSaves(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Saves.map(async Save => {
        let Entity = {};
        // @ts-ignore
        switch (Filter.Type) {
            case "Activity":
                Entity = await SetActivityDataForGet(await ReadOneFromActivities(Save.EntityId), UserId);
                break;
            case "Discussion":
                Entity = await SetDiscussionDataForGet(await ReadOneFromDiscussions(Save.EntityId), UserId)
                break;
            case "Article":
                Entity = await SetArticleDataForGet(await ReadOneFromArticles(Save.EntityId), UserId);
                break;
            default:
                break;
        }
        //@ts-ignore
        return { ...Entity, NextId: Save.NextId }
    }))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostSaves = async (req, res) => {
    const { EntityId } = req.body;
    //@ts-ignore
    const { UserId } = req.user;
    const CheckSave = await ReadSaves({ EntityId, UserId }, undefined, 1, undefined);
    if (CheckSave.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Save", "You cannot Save twice"));
    }
    const data = { ...req.body, UserId, EntityId };
    await CreateSaves(data);
    return res.json(true);
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteSaves = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const CheckSave = await ReadSaves({ EntityId, UserId }, undefined, 1, undefined);
    if (CheckSave.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Remove Save", "You have not Saved this activity"));
    }
    const [Save] = CheckSave;
    await RemoveSaves(Save.DocId);
    return res.json(true);
}


export {
    GetSaves, PostSaves, DeleteSaves
}