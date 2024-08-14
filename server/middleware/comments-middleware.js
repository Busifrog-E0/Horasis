const PostCommentsLikeMiddleware = (req, res, next) => {
    req.body = { ...req.body, Type: 'Comment' };
    return next();
}

const InsertActivityInCommentMiddleware = (req, res, next) => {
    req.body = { ...req.body, ParentType: "Activity" };
    return next();
}

const InsertArticleInCommentMiddleware = (req, res, next) => {
    req.body = { ...req.body, ParentType: "Article" };
    return next();
}

export {
    PostCommentsLikeMiddleware,
    InsertActivityInCommentMiddleware,
    InsertArticleInCommentMiddleware
}