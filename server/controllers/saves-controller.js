import e from 'express';

import { ReadOneFromSaves, ReadSaves, UpdateSaves, CreateSaves, RemoveSaves, } from './../databaseControllers/saves-databaseController.js';
import { IncrementActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
/**
 * @typedef {import('./../databaseControllers/saves-databaseController.js').SaveData} SaveData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<SaveData>>}
 */
const GetOneFromSaves = async (req, res) => {
    const { SaveId } = req.params;
    const data = await ReadOneFromSaves(SaveId);
    return res.json(data);
}

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
        const UserDetails = await ReadOneFromUsers(Save.UserId);
        return { ...Save, UserDetails };
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
    const { ActivityId, UserId } = req.params;
    const CheckSave = await ReadSaves({ ActivityId, UserId }, undefined, 1, undefined);
    if (CheckSave.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Save", "You cannot Save twice"));
    }
    const UserDetails = await ReadOneFromUsers(UserId);
    const data = { ActivityId, UserId, UserDetails };
    await CreateSaves(data);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchSaves = async (req, res) => {
    const { SaveId } = req.params;
    await UpdateSaves(req.body, SaveId);
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
    GetOneFromSaves, GetSaves, PostSaves, PatchSaves, DeleteSaves
}