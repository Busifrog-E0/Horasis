import e from 'express';

import { ReadOneFromConversations, ReadConversations, UpdateConversations, CreateConversations, RemoveConversations, } from '../databaseControllers/conversations-databaseController.js';
/**
 * @typedef {import('../databaseControllers/conversations-databaseController.js').ConversationData} ConversationData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<ConversationData>>}
 */
const GetOneFromConversations = async (req, res) => {
    const { ConversationId } = req.params;
    const data = await ReadOneFromConversations(ConversationId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ConversationData>>>}
 */
const GetConversations = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadConversations(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostConversations = async (req, res) => {
    await CreateConversations(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchConversations = async (req, res) => {
    const { ConversationId } = req.params;
    await UpdateConversations(req.body, ConversationId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteConversations = async (req, res) => {
    const { ConversationId } = req.params;
    await RemoveConversations(ConversationId);
    return res.json(true);
}


export {
    GetOneFromConversations, GetConversations, PostConversations, PatchConversations, DeleteConversations
}