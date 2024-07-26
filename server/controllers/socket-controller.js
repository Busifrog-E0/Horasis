import { Socket,Server } from "socket.io";
import { PostMessages } from "./chat-controller";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import { decodeSocketIdToken } from "../middleware/auth-middleware.js";
import { ReadOneFromConversations } from "../databaseControllers/conversations-databaseController.js";


const ConnectSocket = (expressServer) => {


    const io = new Server(expressServer)
    io.use(decodeSocketIdToken);


    io.on('connection', socket => {
        console.log(`User ${socket.id} connected`);
        // @ts-ignore
        socket.join(socket.user.UserId);


        socket.on('Messsage', async data => {
        // @ts-ignore
            data.SenderId = socket.user.UserId;
            const MessageData = await PostMessages(data);
            if (MessageData.Success === true) {
                io.to(data.ConversationId).emit('Messsage', MessageData.Data);
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
            socket.leave(socket.user.UserId);
        })

    })


}


export {
    ConnectSocket
}

function CheckUserInConversation(ConversationData, UserId) {
    throw new Error("Function not implemented.");
}
