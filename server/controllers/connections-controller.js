import e from 'express';

import { ReadOneFromConnections, ReadConnections, UpdateConnections, CreateConnections, RemoveConnections, } from './../databaseControllers/connections-databaseController.js';
import moment from 'moment';
import { AlertBoxObject } from './common.js';
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
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const SenderId = req.user.UserId;
    // @ts-ignore
    Filter.SenderId = SenderId;
    // @ts-ignore
    const data = await ReadConnections(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostSendRequest = async (req, res) => {
    // @ts-ignore
    const SenderId = req.user.UserId;
    const { ReceiverId } = req.body;
    const ConnectionData = {
        UserIds: [SenderId, ReceiverId],
        SenderId: SenderId,
        ReceiverId: ReceiverId,
        CreatedIndex: moment().valueOf(),
        AcceptedIndex: null,
        Status: "Pending",
    };

    if (SenderId === ReceiverId) {
        return res.status(444).send(AlertBoxObject('Invalid Request', 'Cannot send friend request to yourself'));
    }
    const PromiseData = await Promise.all([
        ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined),
        ReadConnections({ SenderId, ReceiverId, Status: "Pending" }, undefined, 1, undefined),
        ReadConnections({ ReceiverId: SenderId, SenderId: ReceiverId, Status: "Pending" }, undefined, 1, undefined),
    ]);
    const existingConnection = PromiseData[0];
    if (existingConnection.length !== 0) {
        return res.status(444).send(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }
    const pendingSentRequest = PromiseData[1];
    if (pendingSentRequest.length !== 0) {
        return res.status(444).send(AlertBoxObject('Request Already Sent', 'Friend request already sent and pending'));
    }
    const pendingReceivedRequest = PromiseData[2];
    if (pendingReceivedRequest.length !== 0) {
        return res.status(444).send(AlertBoxObject('Request Already Received', 'Friend request already received and pending'));
    }
    await CreateConnections(ConnectionData);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostAcceptRequest = async (req, res) => {
    // @ts-ignore
    const UserId = req.user.UserId;
    const { ConnectionId } = req.body;
    const ConnectionData = await ReadOneFromConnections(ConnectionId);
    if (!ConnectionData || ConnectionData.ReceiverId !== UserId || ConnectionData.Status !== "Pending") {
        return res.status(444).send(AlertBoxObject('Connection Invalid', 'Connection Invalid'));
    }
    const { SenderId, ReceiverId } = ConnectionData;

    const existingConnection = await ReadConnections({ UserIds: { $all: [SenderId, ReceiverId] }, Status: "Connected" }, undefined, 1, undefined);
    if (existingConnection.length !== 0) {
        return res.status(444).send(AlertBoxObject('Connection Exists', 'Users are already connected'));
    }

    // check senderId and receiverid valid

    await UpdateConnections({ "Status": "Connected", AcceptedIndex: moment().valueOf() }, ConnectionId);
    return res.json(true);
}

export {
    PostSendRequest, GetAUsersConnections,
}