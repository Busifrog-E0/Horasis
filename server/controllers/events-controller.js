import e from 'express';

import { ReadOneFromEvents, ReadEvents, UpdateEvents, CreateEvents, RemoveEvents, } from './../databaseControllers/events-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/events-databaseController.js').EventData} EventData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<EventData>>}
 */
const GetOneFromEvents = async (req, res) => {
    const { EventId } = req.params;
    const data = await ReadOneFromEvents(EventId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<EventData>>>}
 */
const GetEvents = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter["EventName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const data = await ReadEvents(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostEvents = async (req, res) => {
    await CreateEvents(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchEvents = async (req, res) => {
    const { EventId } = req.params;
    await UpdateEvents(req.body, EventId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteEvents = async (req, res) => {
    const { EventId } = req.params;
    await RemoveEvents(EventId);
    return res.json(true);
}


export {
    GetOneFromEvents, GetEvents, PostEvents, PatchEvents, DeleteEvents
}