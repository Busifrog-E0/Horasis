import e from 'express';

import {  ReadConnections, UpdateConnections, CreateConnections, RemoveConnections, GetConnectionsCount, } from './../databaseControllers/connections-databaseController.js';
import moment from 'moment';
import { AlertBoxObject } from './common.js';
import { AddConnectionstoUser, RemoveConnectionsToUser, ViewOtherUserData } from './users-controller.js';
import { ReadOneFromUsers,  } from '../databaseControllers/users-databaseController.js';
import {  RemoveNotificationsForConnectionRequest, SendNotificationsForConnectionAccept, SendNotificationsForConnectionRequest } from './notifications-controller.js';
import { StartConversation } from './chats-controller.js';
import { ReadConversations, RemoveConversations } from '../databaseControllers/conversations-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/connections-databaseController.js').ConnectionData} ConnectionData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ConnectionData>>>}
 */
const GetAUsersConnections = async (req, res) => {
    const { Filter, Keyword, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const {UserId} = req.user;
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
    const data = await ReadConnections(Filter, NextId, Limit, OrderBy);

    const UserData = await Promise.all(data.map(id => ViewOtherUserData(UserId,
        id.UserIds.filter(element => element !== UserId)[0], id)));
    return res.json(UserData);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostConnectionSend = async (req, res) => {
    // @ts-ignore
    const SenderId = req.user.UserId;
    const { ReceiverId } = req.params;
    const ConnectionData = {
        UserIds: [SenderId, ReceiverId],
        SenderId: SenderId,
        ReceiverId: ReceiverId,
        CreatedIndex: moment().valueOf(),
        AcceptedIndex: null,
        Status: "Pending",
    };

    if (SenderId === ReceiverId) {
        return res.status(444).json(AlertBoxObject('Invalid Request', 'Cannot send friend request to yourself'));
    }
    const PromiseData = await Promise.all([
        ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined),
        ReadConnections({ SenderId, ReceiverId, Status: "Pending" }, undefined, 1, undefined),
        ReadConnections({ ReceiverId: SenderId, SenderId: ReceiverId, Status: "Pending" }, undefined, 1, undefined),
        ReadOneFromUsers(SenderId),
        ReadOneFromUsers(ReceiverId),
    ]);
    const [existingConnection, pendingSentRequest, pendingReceivedRequest] = PromiseData;
    if (existingConnection.length !== 0) {
        return res.status(444).json(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }
    if (pendingSentRequest.length !== 0) {
        return res.status(444).json(AlertBoxObject('Request Already Sent', 'Friend request already sent and pending'));
    }
    if (pendingReceivedRequest.length !== 0) {
        return res.status(444).json(AlertBoxObject('Request Already Received', 'Friend request already received and pending'));
    }

    ConnectionData.UserDetails = [PromiseData[3], PromiseData[4]];
    const ConnectionId = await CreateConnections(ConnectionData);
    await SendNotificationsForConnectionRequest(ConnectionId, PromiseData[3], PromiseData[4]);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>|true>}
 */
const PostConnectionAccept = async (req, res) => {
    // @ts-ignore
    const ReceiverId = req.user.UserId;
    const { SenderId } = req.params;

    const existingConnection = await ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined);
    if (existingConnection.length !== 0) {
        return res.status(444).json(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }

    const [ConnectionData] = (await ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Pending" }, undefined, 1, undefined));
    if (!ConnectionData || ConnectionData.ReceiverId !== ReceiverId) {
        return res.status(444).json(AlertBoxObject('Connection Invalid', 'Connection Invalid'));
    }

    // check senderId and receiverid valid

    await UpdateConnections({ "Status": "Connected", AcceptedIndex: moment().valueOf() }, ConnectionData.DocId);
    await SendNotificationsForConnectionAccept(ConnectionData.DocId, SenderId, ReceiverId);
    AddConnectionstoUser(ReceiverId, SenderId);
    AddConnectionstoUser(SenderId, ReceiverId);
    res.json(true);

    // create conversation Id when created
    const CheckConversation = await ReadConversations({ ParticipantIds: { $all: [SenderId, ReceiverId] } }, undefined, 1, undefined);
    if (CheckConversation.length === 0) {
        await StartConversation({ "DocId": SenderId }, { "DocId": ReceiverId }, true);
    }
    return true
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteConnectionReject = async (req, res) => {
    // @ts-ignore
    const ReceiverId = req.user.UserId;
    const { SenderId } = req.params;

    const existingConnection = await ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined);
    if (existingConnection.length !== 0) {
        return res.status(444).json(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }
    const [ConnectionData] = (await ReadConnections({ SenderId, ReceiverId, "Status": "Pending" }, undefined, 1, undefined));
    if (!ConnectionData) {
        return res.status(444).json(AlertBoxObject('Invalid Request', 'No pending friend request from this user'));
    }
    await RemoveConnections(ConnectionData.DocId);
    return res.json(true)
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteConnectionCancel = async (req, res) => {
    // @ts-ignore
    const SenderId = req.user.UserId;
    const { ReceiverId } = req.params;

    const existingConnection = await ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined);
    if (existingConnection.length !== 0) {
        return res.status(444).json(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }
    const [ConnectionData] = (await ReadConnections({ SenderId, ReceiverId, "Status": "Pending" }, undefined, 1, undefined));
    if (!ConnectionData) {
        return res.status(444).json(AlertBoxObject('Invalid Request', 'No pending request '));
    }
    await RemoveConnections(ConnectionData.DocId);
    return res.json(true)
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>|true>}
 */
const DeleteConnection = async (req, res) => {

    // @ts-ignore
    const MyId = req.user.UserId;
    const { UserId } = req.params;

    const [ConnectionData] = (await ReadConnections({ UserIds: { $all: [MyId, UserId] }, Status: "Connected" }, undefined, 1, undefined));
    if (!ConnectionData) {
        return res.status(444).json(AlertBoxObject('No Connection Exists', 'Users are not connected'));
    }
    await RemoveConnections(ConnectionData.DocId);
    await RemoveNotificationsForConnectionRequest(ConnectionData.DocId);
    RemoveConnectionsToUser(ConnectionData.ReceiverId, ConnectionData.SenderId);
    RemoveConnectionsToUser(ConnectionData.SenderId, ConnectionData.ReceiverId);
    res.json(true);

    const CheckConversation = await ReadConversations({ ParticipantIds: { $all: [MyId, UserId] }, OneMessageSent: false }, undefined, 1, undefined);
    if (CheckConversation.length === 1) {
        await RemoveConversations(CheckConversation[0].DocId);
    }
    return true;

}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetConnectionsNumber = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.params;
    return res.json(await GetConnectionsCount({ UserIds: UserId, Status: "Connected" }))
}


/**
 * 
 * @param {string} MyId 
 * @param {string} TheirId 
 */
const ConnectionStatus = async (MyId, TheirId) => {
    if (MyId === TheirId) {
        return { Status: "No Connection", ConnectionIndex: 0 };
    }
    const [ConnectionData] = (await ReadConnections({ UserIds: { $all: [MyId, TheirId] } }, undefined, 1, undefined));
    if (!ConnectionData) {
        return { Status: "No Connection", ConnectionIndex: 0 };
    }
    else if (ConnectionData.Status === "Connected") {
        return { Status: "Connected", ConnectionIndex: ConnectionData.AcceptedIndex };
    }
    else if (ConnectionData.ReceiverId === MyId) {
        return { Status: "Connection Received", ConnectionIndex: ConnectionData.CreatedIndex };
    }
    return { Status: "Connection Requested", ConnectionIndex: ConnectionData.CreatedIndex };
}

export {
    GetAUsersConnections,
    PostConnectionSend,
    PostConnectionAccept,
    DeleteConnectionReject,
    DeleteConnectionCancel,
    DeleteConnection,
    GetConnectionsNumber,

    ConnectionStatus,
}