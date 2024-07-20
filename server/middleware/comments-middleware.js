const PostCommentsLikeMiddleware = (req, res, next) => {
    req.body = { ...req.body, Type: 'Comment' };
    return next();
}

export {
    PostCommentsLikeMiddleware
}