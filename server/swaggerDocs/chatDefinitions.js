import usersDefinitions from "./usersDefinitions.js";


const MessageData = {
    "ConversationId": "60c72b345f1b2c0015a4e7d3",
    "SenderId": "60c72b2f5f1b2c0015a4e7d0",
    "Content": "Hello, Bob!",
    "CreatedIndex": 1,
    "SeenUsers": [
        { UserId: '60c72b345f1b2c0015a4e7d3', SeenIndex: 5 },
    ],
    "DocId": "60c72b365f1b2c0015a4e7d2"
};

const ConversationData = {
    "UserDetails": [
        usersDefinitions.UserData,
        usersDefinitions.UserData,
    ],
    "ParticipantIds": ["60c72b2f5f1b2c0015a4e7d0", "60c72b305f1b2c0015a4e7d1"],
    "LatestMessage": MessageData,
    "OneMessageSent": true,
    "CreatedIndex": 1,
    "DocId": "60c72b345f1b2c0015a4e7d3"
};


const MessageDataArray = [MessageData];
const ConversationDataArray = [ConversationData];
export default {
    ConversationData, MessageData,
    ConversationDataArray,MessageDataArray
}