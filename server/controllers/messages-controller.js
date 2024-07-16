import e from 'express';

import { ReadOneFromMessages, ReadMessages, UpdateMessages, CreateMessages, RemoveMessages, } from './../databaseControllers/messages-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/messages-databaseController.js').MessageData} MessageData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<MessageData>>}
 */
const GetOneFromMessages = async (req, res) => {
    const { MessageId } = req.params;
    const data = await ReadOneFromMessages(MessageId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<MessageData>>>}
 */
const GetMessages = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadMessages(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostMessages = async (req, res) => {
    await CreateMessages(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchMessages = async (req, res) => {
    const { MessageId } = req.params;
    await UpdateMessages(req.body, MessageId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteMessages = async (req, res) => {
    const { MessageId } = req.params;
    await RemoveMessages(MessageId);
    return res.json(true);
}


export {
    GetOneFromMessages, GetMessages, PostMessages, PatchMessages, DeleteMessages
}