import {
    CreateConversations, ReadConversations, ReadOneFromConversations,
     UpdateConversations
} from "../databaseControllers/conversations-databaseController.js";
import { CreateMessages, GetMessagesCount, ReadMessages, UpdateManyMessage,  } from "../databaseControllers/messages-databaseController.js";
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
    // Filter.OneMessageSent = true;
    //@ts-ignore
    let data = await ReadConversations({ ...Filter }, NextId, Limit, OrderBy);

    // later fix coversation 
    if (data.length !== Number(Limit || 10) && Number(Limit) !== -1) {
        //@ts-ignore
        let data2 = await ReadConversations({ ...Filter }, NextId, Limit - data.length);
        data = [...data, ...data2];
    }

    await Promise.all(data.map(async ConversationData => {
        // @ts-ignore
        ConversationData.NumberOfUnseenMessages = await GetMessagesCount({
            "ConversationId": ConversationData.DocId, SenderId: { "$ne": UserId },
            "SeenUsers.UserId": { "$ne": UserId }
        });
        return ConversationData;
    }));

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
        await UpdateAllNotSeenMessages(ConversationId, UserId);
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
    const ConversationId = await StartConversation(SenderData, ReceiverData);
    return res.json(ConversationId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchSeeAllMessages = async (req, res) => {
    // @ts-ignore
    const {UserId} = req.user;
    const { ConversationId } = req.params;

    await UpdateAllNotSeenMessages(ConversationId, UserId);
    return res.json(true);
}

/**
 * 
 * @param {import("../databaseControllers/users-databaseController.js").UserData|{DocId:string}} SenderData 
 * @param {import("../databaseControllers/users-databaseController.js").UserData|{DocId:string}} ReceiverData 
 * @param {boolean} RetrieveFromDatabase 
 * @returns {Promise<string>}
 */
const StartConversation = async (SenderData, ReceiverData, RetrieveFromDatabase = false) => {
    if (RetrieveFromDatabase) {
        [SenderData, ReceiverData] = await Promise.all([
            ReadOneFromUsers(SenderData.DocId),
            ReadOneFromUsers(ReceiverData.DocId)
        ]);
    }
    let ConversationData = {
        UserDetails: [SenderData, ReceiverData],
        ParticipantIds: [SenderData.DocId, ReceiverData.DocId]
    };
    ConversationData = ConversationInit(ConversationData);
    return CreateConversations(ConversationData);
}

/**
 * 
 * @param {{ConversationId:string,SenderId:string,Content:string}} data
 * @returns {Promise<{Success:boolean,Data:object,ParticipantIds:Array}>}
 */
const PostMessages = async (data) => {
    const { ConversationId, SenderId } = data;
    const ConversationData = await ReadOneFromConversations(ConversationId);
    if (!CheckUserInConversation(ConversationData, SenderId)) {
        return { Success: false, Data: {}, ParticipantIds: [] };
    }
    data = MessageInit(data);
    await Promise.all([
        CreateMessages(data),
        UpdateConversations({ LatestMessage: data, OneMessageSent: true }, ConversationId),
    ])
    return { Success: true, Data: data, ParticipantIds: ConversationData.ParticipantIds };
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

/**
 * 
 * @param {string} UserId 
 * @param {string} ConversationId 
 */
const UpdateAllNotSeenMessages = async (ConversationId, UserId) => {
    return UpdateManyMessage({ "SeenUsers.UserId": { "$ne": UserId }, ConversationId }, { SeenUsers: { UserId, SeenIndex: moment().valueOf() } }, ["$push"]);
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
        CreatedIndex: moment().valueOf(),
        Index: `${moment().valueOf()}`,
    }
}

export {
    PostMessages,
    GetMessages,
    GetConversations,
    ReterieveConversationId,
    PatchSeeAllMessages,
    CheckUserInConversation,
    UpdateAllNotSeenMessages,
    StartConversation
}