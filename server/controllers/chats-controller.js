import {
    CreateConversations, ReadConversations, ReadOneFromConversations,
    UpdateAndIncrementConversations, UpdateConversations
} from "../databaseControllers/conversations-databaseController.js";
import { CreateMessages, ReadMessages, UpdateManyMessage, UpdateMessages } from "../databaseControllers/messages-databaseController.js";
import e, { json } from 'express'
import { ReadOneFromUsers } from "../databaseControllers/users-databaseController.js";
import { AlertBoxObject } from "./common.js";
import moment from "moment-timezone";

/**
 * @typedef {import('../databaseControllers/conversations-databaseController.js').ConversationData} ConversationData 
 */
/**
 * @typedef {import("../databaseControllers/messages-databaseController.js").MessageData}  MessageData
 */



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ConversationData>>>}
 */
const GetConversations = async (req, res) => {
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    //@ts-ignore
    const { UserId } = req.user;
    if (Keyword) {
        //@ts-ignore
        Filter.UserDetails = {
            $elemMatch: {
                $or: [
                    { 'Username': { $regex: Keyword, $options: 'i' } },
                    { 'FullName': { $regex: Keyword, $options: 'i' } }
                ],
                'DocId': { $ne: UserId }
            }
        };
    }
    // @ts-ignore
    Filter.ParticipantIds = { '$in': [UserId] };
    // @ts-ignore
    Filter.OneMessageSent = true;
    //@ts-ignore
    const data = await ReadConversations(Filter, NextId, Limit, OrderBy);
    return res.json(data);
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
    const { UserId } = req.user;

    const ConversationData = await ReadOneFromConversations(ConversationId);
    if (!CheckUserInConversation(ConversationData, UserId)) {
        return res.status(444).json(AlertBoxObject("No Access", "You have no access to these messages."));
    }

    // @ts-ignore
    Filter.ConversationId = ConversationId;
    // @ts-ignore
    const data = await ReadMessages(Filter, NextId, Limit, OrderBy);
    if (!NextId) {
        await UpdateAllNotSeenMessages(UserId);
    }
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<string>>}
 */
const ReterieveConversationId = async (req, res) => {

    // @ts-ignore
    const SenderId = req.user.UserId;

    const { ReceiverId } = req.body;
    const CheckConversation = await ReadConversations({ ParticipantIds: { $all: [SenderId, ReceiverId] } }, undefined, 1, undefined);
    if (CheckConversation.length > 0) {
        return res.json(CheckConversation[0].DocId);
    }

    const [SenderData, ReceiverData] = await Promise.all([
        ReadOneFromUsers(SenderId),
        ReadOneFromUsers(ReceiverId),
    ]);
    if (!SenderData || !ReceiverId) {
        return res.status(444).json(AlertBoxObject("Invalid User", "User doesn't exists."));
    }

    let ConversationData = {
        UserDetails: [SenderData, ReceiverData],
        ParticipantIds: [SenderId, ReceiverId]
    };
    ConversationData = ConversationInit(ConversationData);
    const ConversationId = await CreateConversations(ConversationData);
    return res.json(ConversationId);
}

/**
 * 
 * @param {{ConversationId:string,SenderId:string,Content:string}} data
 * @returns {Promise<{Success:boolean,Data:object}>}
 */
const PostMessages = async (data) => {
    const { ConversationId, SenderId } = data;
    const ConversationData = await ReadOneFromConversations(ConversationId);
    if (!CheckUserInConversation(ConversationData, SenderId)) {
        return { Success: false, Data: {} };
    }
    data = MessageInit(data);
    await Promise.all([
        CreateMessages(data),
        UpdateConversations({ LatestMessage: data }, ConversationId),
    ])
    return { Success: true, Data: data };
}

const ConversationInit = (Conversation) => {
    return {
        ...Conversation,
        OneMessageSent: false,
        LastMessage: {}
    }
}

const MessageInit = (Message) => {
    return {
        ...Message,
        SeenUsers: [],
    }
}

/**
 * 
 * @param {ConversationData} ConversationData 
 * @param {string} UserId 
 * @returns {boolean}
 */
const CheckUserInConversation = (ConversationData, UserId) => {
    if (!ConversationData) {
        return false;
    }
    return ConversationData.ParticipantIds.includes(UserId)
}

const UpdateAllNotSeenMessages = async (UserId) => {
    await UpdateManyMessage({ SeenUsers: { "$ne": UserId } }, { SeenUsers: { UserId, SeenIndex: moment().valueOf() } }, ["$push"]);
}

export {
    PostMessages,
    GetMessages,
    GetConversations,
    ReterieveConversationId,
}