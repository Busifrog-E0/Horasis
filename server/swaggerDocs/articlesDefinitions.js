import usersDefinitions from "./usersDefinitions.js";


const ArticleData = {
    ArticleName: "Introduction to Node.js",
    Description: "A comprehensive guide to getting started with Node.js.",
    Content: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    DocId: "abc123",
    CoverPhoto: "https://example.com/images/nodejs-cover.jpg",
    CreatedIndex: 1,
    AuthorId: "author456",
    UserDetails: usersDefinitions.UserData
}


const ArticleDataArray = [ArticleData];

const PostArticleData = {
    ArticleName: "Introduction to Node.js",
    Description: "A comprehensive guide to getting started with Node.js.",
    Content: "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    CoverPhoto: "https://example.com/images/nodejs-cover.jpg",
    AuthorId: "author456",
}

export default {
    ArticleData,
    ArticleDataArray,
    PostArticleData
}