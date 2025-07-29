import usersDefinitions from "./usersDefinitions.js"

const CommentData = {
    Content: "This is a sample comment content.",
    ParentId: "1234567890abcdef",
    UserId: "user12345",
    DocId: "comment12345",
    NoOfReplies: 5,
    Type: "Comment",
    User  : usersDefinitions.UserData
}   

const CommentDataArray = [CommentData];
export default {
    CommentData,
    CommentDataArray
}
