import e from 'express';

import { ReadSaves, CreateSaves, RemoveSaves, } from './../databaseControllers/saves-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromArticles } from '../databaseControllers/articles-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/saves-databaseController.js').SaveData} SaveData 
 */



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<SaveData>>>}
 */
const GetSaves = async (req, res) => {
    const { UserId } = req.params;
    let data = {};
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.UserId = UserId;
    // @ts-ignore
    const Saves = await ReadSaves(Filter, NextId, Limit, OrderBy);
    if (req.body.Type === "Activity") {
        data = await Promise.all(Saves.map(async Save => {
            const Activity = await ReadOneFromActivities(Save.EntityId);
            const [UserDetails, checkLike] = await Promise.all([
                ReadOneFromUsers(Activity.UserId),
                ReadLikes({ EntityId: Activity.DocId, UserId }, undefined, 1, undefined),
            ])
            const HasSaved = true;
            const HasLiked = checkLike.length > 0;
            //@ts-ignore
            return { ...Activity, UserDetails, HasLiked, HasSaved, NextId: Save.NextId }
        }));

    }
    if (req.body.Type === "Discussion") {
        data = await Promise.all(Saves.map(async Save => {
            const Discussion = await ReadOneFromDiscussions(Save.EntityId);
            const [UserDetails] = await Promise.all([
                ReadOneFromUsers(Discussion.OrganiserId),
            ])
            const HasSaved = true;
            //@ts-ignore
            return { ...Discussion, UserDetails, HasSaved, NextId: Save.NextId }
        }));

    }
    if (req.body.Type === "Article") {
        data = await Promise.all(Saves.map(async Save => {
            const Article = await ReadOneFromArticles(Save.EntityId);
            const [UserDetails] = await Promise.all([
                ReadOneFromUsers(Article.AuthorId),
            ])
            const HasSaved = true;
            //@ts-ignore
            return { ...Article, UserDetails, HasSaved, NextId: Save.NextId }
        }));
    }
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
    const data = { ...req.body, UserId };
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