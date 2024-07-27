import { Socket,Server } from "socket.io";
import { PostMessages, CheckUserInConversation } from "./chats-controller.js";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import { decodeSocketIdToken } from "../middleware/auth-middleware.js";
import { ReadOneFromConversations } from "../databaseControllers/conversations-databaseController.js";


const ConnectSocket = (expressServer) => {


    const io = new Server(expressServer, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        }
    });
    io.use(decodeSocketIdToken);


    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);
        // @ts-ignore
        socket.join(socket.user.UserId);


        socket.on('Messsage', async data => {
        // @ts-ignore
            data.SenderId = socket.user.UserId;
            const MessageData = await PostMessages(data);
            console.log('Messsage ', data);

            if (MessageData.Success === true) {
                io.to(data.ConversationId).emit('Messsage', MessageData.Data);
                console.log('Messsage2 ', data);

                MessageData.ParticipantIds.map(id => {
                    io.to(id).emit('CoversationList', true);
                })
            }
        })

        socket.on('JoinRoom', async ({ ConversationId }) => {
            console.log('JoinRoom ', ConversationId);
            const ConversationData = await ReadOneFromConversations(ConversationId);
        // @ts-ignore
            if (CheckUserInConversation(ConversationData, socket.user.UserId)) {
                // leave existing rooms?
                socket.join(ConversationId);
                // @ts-ignore
                console.log('JoinRoom ', ConversationId, socket.user.UserId);

            }

        });

        socket.on('LeaveRoom', ({ ConversationId }) => {
            socket.leave(ConversationId);
        });

        // When user disconnects - to all others 
        socket.on('disconnect', () => {
            // @ts-ignore
            socket.leave(socket.user.UserId);
        })

    })


}


export {
    ConnectSocket
}
