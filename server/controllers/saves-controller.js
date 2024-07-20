import e from 'express';

import { ReadSaves, CreateSaves, RemoveSaves, } from './../databaseControllers/saves-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
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
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.UserId = UserId;
    //@ts-ignore
    const Saves = await ReadSaves(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Saves.map(async Save => {
        const Activity = await ReadOneFromActivities(Save.ActivityId);
        const [UserDetails, checkLike, checkSave] = await Promise.all([
            ReadOneFromUsers(Activity.UserId),
            ReadLikes({ ActivityId: Activity.DocId, UserId }, undefined, 1, undefined),
            ReadSaves({ ActivityId: Activity.DocId, UserId }, undefined, 1, undefined)
        ])
        const HasSaved = checkSave.length > 0;
        const HasLiked = checkLike.length > 0;
        return { ...Activity, UserDetails, HasLiked, HasSaved }
    }));
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostSaves = async (req, res) => {
    const { ActivityId, UserId } = req.params;
    const CheckSave = await ReadSaves({ ActivityId, UserId }, undefined, 1, undefined);
    if (CheckSave.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Save", "You cannot Save twice"));
    }
    const ActivityDetails = await ReadOneFromActivities(ActivityId);
    const UserDetails = await ReadOneFromUsers(ActivityDetails.UserId);
    const data = { ActivityId, UserId };
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
    const { ActivityId, UserId } = req.params;
    const CheckSave = await ReadSaves({ ActivityId, UserId }, undefined, 1, undefined);
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