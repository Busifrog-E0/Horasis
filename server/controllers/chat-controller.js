import {
    CreateConversations, ReadConversations, ReadOneFromConversations,
    UpdateAndIncrementConversations, UpdateConversations
} from "../databaseControllers/conversations-databaseController.js";
import { CreateMessages, ReadMessages } from "../databaseControllers/messages-databaseController.js";
import e from 'express'
import { ReadOneFromUsers } from "../databaseControllers/users-databaseController.js";


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
    const { Filter, NextId,Keyword, Limit, OrderBy } = req.query;
    const { UserId } = req.params;
    if (Keyword) {
        //@ts-ignore
        Filter.$or = [
            { 'UserDetails.Username': { '$regex': Keyword, '$options': 'i' } },
            { 'UserDetails.FullName': { '$regex': Keyword, '$options': 'i' } }
        ];
    }
    // @ts-ignore
    Filter.ParticipantIds = { '$in': [UserId] }
    //@ts-ignore
    const data = await ReadConversations(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}
/*
const updateUserDetails = async (userId, updatedUserDetails) => {
    await Conversation.updateMany({ "ParticipantIds": { "$in": [userId] } }, { $set: { "UserDetails.$[elem]": updatedUserDetails } }, { arrayFilters: [{ "elem.UserId": userId }] });
    await Activity.updateMany({ "UserId": userId }, { $set: { "UserDetails": updatedUserDetails } });
}
    */
/**
 * 
 * @param {object} data
 * @returns {Promise<boolean>}
 */
const PostMessages = async (data) => {
    const { SenderId, ReceiverId } = data;
    const ParticipantIds = [SenderId, ReceiverId];
    const ConversationData = await ReadConversations({ ParticipantIds: { '$all': ParticipantIds } }, undefined, 1, undefined);
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
    data = MessageInit(data);
    data = { ...data, ConversationId, SenderId, ReceiverId };
    await CreateMessages(data);
    await UpdateAndIncrementConversations({ LatestMessage: data }, { UnreadMessages: 1 }, ConversationId);
    return true;
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

const MessageInit = (Message) => {
    return {
        ...Message,
    }
}

export {
    PostMessages,
    GetMessages,
    GetConversations,
    GetOneFromConversations
}