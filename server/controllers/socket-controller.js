
import { Socket,Server } from "socket.io";
import { PostMessages } from "./chat-controller";

/**
 * 
 * @param {Socket} socket 
 * @param {Server} io 
 */
const JoinRoom = async (socket,io) => {
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
    HandleMessageEvent
}