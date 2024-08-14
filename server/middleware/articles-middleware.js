const InsertArticleTypeMiddleware = (req, res, next) => {
    req.body = {...req.body, Type: 'Article'}
}

export {
    InsertArticleTypeMiddleware
}