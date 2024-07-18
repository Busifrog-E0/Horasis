import usersDefinitions from "./usersDefinitions.js";

const ActivityPostData = {
    Content: "This is a sample activity content.",
    UserId: "user123",
    MediaFiles: [{ FileData :  [],FileName : "string"}],
    Documents: [{ FileData: [], FileName: "string" }]
}

const ActivityGetData = {
    Content: "This is a sample activity content.",
    UserId: "user123",
    MediaFiles: ["https://example.com/image.jpg"],
    Documents: ["https://example.com/document.pdf"],
    Mentions: [{"Username" : "user1345", "UserId" : "6df8f7wed689ef"}],
    NoOfLikes: 2,
    NoOfComments: 2,
    DocId: "activity_1234", 
    UserDetails: usersDefinitions.UserData,
    HasLiked: true
};

const ActivityGetDataArray = [ActivityGetData];


export default {
    ActivityPostData,
    ActivityGetData,
    ActivityGetDataArray
}