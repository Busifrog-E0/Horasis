import { Socket,Server } from "socket.io";
import { PostMessages } from "./chat-controller";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";

/**
 * 
 * @param {Socket} socket 
 * @param {Function} next 
 * @returns 
 */
const decodeSocketIdToken = (socket,next) => {
    const authHeader = socket.handshake.auth.token || "";
    const token = authHeader.split(" ")[1];
    if (!token) {
        return next(new Error('Authentication token is missing'));
    }
    try {
        const user = jwt.verify(token, ENV.TOKEN_KEY);
        // @ts-ignore
        socket.user = user;
        // @ts-ignore
    } catch (err) {
        return next(new Error('Invalid Token'));
    }
    return next();
}
/**
 * 
 * @param  {...string} Roles 
 * @returns 
 */
const ensureSocketAuthorized = (...Roles) => (/** @type {Socket} */socket,/** @type {Function} */ next) => {
    // @ts-ignore
    if (!Roles.includes(socket.user.Role)) {
        return next(new Error('invalid roles' ));
    }
    else {
        return next();
    }
}

/**
 * 
 * @param {Socket} socket 
 * @param {Server} io 
 */
const JoinRoom =  (socket,io) => {
    socket.on('join_room', ({ ConversationId }) => {
        socket.join(ConversationId);
        console.log(`User joined room: ${ConversationId}`);
    });
}

/**
 * 
 * @param {Socket} socket 
 * @param {Server} io 
 */
const HandleMessageEvent = async (socket, io) => { 
    socket.on('Message', async ({ ConversationId, Message }) => {
        console.log('message:', Message);
        await PostMessages(Message); 
        io.to(ConversationId).emit('Message', Message);
    });
}

export {
    JoinRoom,
    HandleMessageEvent,
    decodeSocketIdToken,
    ensureSocketAuthorized,
}