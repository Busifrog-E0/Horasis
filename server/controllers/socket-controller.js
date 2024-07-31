import { Socket, Server } from "socket.io";
import { PostMessages, CheckUserInConversation } from "./chats-controller.js";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import { decodeSocketIdToken } from "../middleware/auth-middleware.js";
import { ReadOneFromConversations } from "../databaseControllers/conversations-databaseController.js";


const ConnectSocket = (expressServer) => {


    const io = new Server(expressServer, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://hsocial.web.app/"]
        }
    });
    io.use(decodeSocketIdToken);


    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);
        // @ts-ignore
        socket.join(socket.user.UserId);


        socket.on('Message', async data => {
            // @ts-ignore
            data.SenderId = socket.user.UserId;
            const MessageData = await PostMessages(data);

            if (MessageData.Success === true) {
                io.to(data.ConversationId).emit('Message', MessageData.Data);

                MessageData.ParticipantIds.map(id => {
                    io.to(id).emit('ConversationList', true);
                })
            }
        })

        socket.on('JoinRoom', async ({ ConversationId }) => {
            const ConversationData = await ReadOneFromConversations(ConversationId);
            // @ts-ignore
            if (CheckUserInConversation(ConversationData, socket.user.UserId)) {
                // leave existing rooms?
                socket.join(ConversationId);
                // @ts-ignore

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
