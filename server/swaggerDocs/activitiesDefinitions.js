const ActivityPostData = {
    Content: "This is a sample activity content.",
    UserId: "user123",
    Attachments: ["https://example.com/image.jpg", "https://example.com/document.pdf"],
}

const ActivityGetData = {
    Content: "This is a sample activity content.",
    UserId: "user123",
    MediaFiles: ["https://example.com/image.jpg"],
    Documents: ["https://example.com/document.pdf"],
    Mentions: [{"Username" : "user1345", "UserId" : "6df8f7wed689ef"}],
    LikedIds: ["user987", "user000"],
    Attachments: [[], []],
    NoOfLikes: 2,
    NoOfComments: 2,
    DocId: "activity_1234", 
    Type: "Feed", 
    ParentId: "7adcadfa99asffda1b", 
};

const ActivityGetDataArray = [ActivityGetData];


export default {
    ActivityPostData,
    ActivityGetData,
    ActivityGetDataArray
}