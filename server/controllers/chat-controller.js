import { CreateConversations, ReadConversations, ReadOneFromConversations, UpdateAndIncrementConversations, UpdateConversations } from "../databaseControllers/conversations-databaseController";
import { CreateMessages, ReadMessages } from "../databaseControllers/messages-databaseController";
import e from 'express'
import { ReadOneFromUsers } from "../databaseControllers/users-databaseController";
import { UpdateAndIncrementActivities } from "../databaseControllers/activities-databaseController.js";

/**
 * @typedef {import('../databaseControllers/conversations-databaseController.js').ConversationData} ConversationData 
 */
/**
 * @typedef {import("../databaseControllers/messages-databaseController").MessageData}  MessageData
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
    const { UserId } = req.params;
    // @ts-ignore
    Filter.ParticipantIds = { '$in': [UserId] }
    //@ts-ignore
    const data = await ReadConversations(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostMessages = async (req, res) => {
    const { SenderId, ReceiverId } = req.params;
    const ParticipantIds = [SenderId, ReceiverId];
    const ConversationData = await ReadConversations({ '$all': ParticipantIds }, undefined, 1, undefined);
    let ConversationId;
    if (ConversationData.length == 0) {
        const UserDetails = await Promise.all(ParticipantIds.map(async UserId => {
            return await ReadOneFromUsers(UserId);
        }));
        const Conversation = ConversationInit({ UserDetails, ParticipantIds });
        ConversationId = await CreateConversations(Conversation)
    }
    else {
        ConversationId = ConversationData[0].DocId;
    }
    req.body = MessageInit(req.body, SenderId, ConversationId);
    await CreateMessages(req.body);
    await UpdateAndIncrementConversations({ LatestMessage: req.body }, { UnreadMessages: 1 }, ConversationId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<MessageData>>>}
 */
const GetMessages = async (req, res) => {
    const { ConversationId } = req.params;
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.ConversationId = ConversationId;
    // @ts-ignore
    const data = await ReadMessages(Filter, NextId, Limit, OrderBy);
    await UpdateConversations({ UnreadMessages: 0 }, ConversationId);
    return res.json(data);
}


const ConversationInit = (Conversation) => {
    return {
        ...Conversation,
        UnreadMessages: 0,
        LastMessage: {}
    }
}

const MessageInit = (Message, SenderId, ConversationId) => {
    return {
        ...Message,
        SenderId,
        ConversationId,
        HasSeen: false,
    }
}