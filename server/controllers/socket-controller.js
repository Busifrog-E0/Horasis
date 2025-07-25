import { Socket, Server } from "socket.io";
import { PostMessages, CheckUserInConversation } from "./chats-controller.js";
import { ReadOneFromUsers, UpdateUsers } from "../databaseControllers/users-databaseController.js"
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import { decodeSocketIdToken } from "../middleware/auth-middleware.js";
import { ReadOneFromConversations } from "../databaseControllers/conversations-databaseController.js";
import moment from "moment";
import { PostActiveUsers } from "./activeUsers-controller.js";
import { CreateParticipants, ReadParticipants, RemoveParticipants } from "../databaseControllers/participants-databaseController.js";
import { ReadMembers } from "../databaseControllers/members-databaseController.js";
import { ReadSpeakers } from "../databaseControllers/speakers-databaseController.js";


const ConnectSocket = (expressServer) => {


    const io = new Server(expressServer, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://hsocial.web.app", "https://hsocialtest.web.app", "https://tcs-networking.web.app"]
        }
    });
    io.use(decodeSocketIdToken);


    io.on('connection', socket => {
        // @ts-ignore
        UpdateUsers({ Online: true }, socket.user.UserId);
        //@ts-ignore
        PostActiveUsers(socket.user.UserId);
        //@ts-ignore
        socket.join(socket.user.UserId);

        socket.on('Message', async data => {

            // @ts-ignore
            data.SenderId = socket.user.UserId;
            const MessageData = await PostMessages(data);

            if (MessageData.Success === true) {
                io.to(data.ConversationId).emit('Message', MessageData.Data);


                MessageData.ParticipantIds.map(id => {
                    // @ts-ignore
                    if (id !== socket.user.UserId) {
                        io.to(id).emit('ConversationList', true)
                    };
                })
            }
        })

        socket.on('JoinRoom', async ({ ConversationId }) => {
            const ConversationData = await ReadOneFromConversations(ConversationId);
            // @ts-ignore
            if (CheckUserInConversation(ConversationData, socket.user.UserId)) {
                // leave existing rooms?
                socket.join(ConversationId);
                
            }

        });

        socket.on('LeaveRoom', ({ ConversationId }) => {
            socket.leave(ConversationId);
        });

        // When user disconnects - to all others 
        socket.on('disconnect', () => {
            // @ts-ignore
            UpdateUsers({ Online: false, LastActive: moment().valueOf() }, socket.user.UserId);
            //@ts-ignore
            socket.leave(socket.user.UserId);
        })

    })


}


export {
    ConnectSocket
}
