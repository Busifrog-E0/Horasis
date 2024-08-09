const InsertEventTypeMiddleware = async (req, res, next) => {
    req.body.Type = "Event";
    return next();
}

export { InsertEventTypeMiddleware }