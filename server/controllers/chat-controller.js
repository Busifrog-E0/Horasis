import { CreateConversations, ReadConversations, ReadOneFromConversations, UpdateConversations } from "../databaseControllers/conversations-databaseController";
import { CreateMessages } from "../databaseControllers/messages-databaseController";
import e from 'express'
import { ReadOneFromUsers } from "../databaseControllers/users-databaseController";

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
    Filter.ParticipantIds =  { '$in' : }
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
    await UpdateConversations({ LatestMessage: req.body }, ConversationId);
    return res.json(true);
}


const ConversationInit = (Conversation) => {
    return {
        ...Conversation,
        UnreadMessages: 0,
        LastMessage : {}
    }
}

const MessageInit = (Message,SenderId,ConversationId) => {
    return {
        ...Message,
        SenderId,
        ConversationId,
        HasSeen : false,
    }
}