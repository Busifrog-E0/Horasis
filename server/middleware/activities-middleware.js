const GetFeedActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { Type: "Feed", ...req.query.Filter };
    return next();
}

const GetEventActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { Type: "Event", ...req.query.Filter };
    return next();
}

const GetDiscussionActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { Type: "Discussion", ...req.query.Filter };
    return next();
}

const PostFeedActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Feed", ...req.body };
    return next();
}

const PostEventActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Event", ...req.body };
    return next();
}

const PostDiscussionActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Discussion", ...req.body };
    return next();
}

export { 
    GetFeedActivitiesMiddleware, GetEventActivitiesMiddleware, GetDiscussionActivitiesMiddleware,
    PostDiscussionActivitiesMiddleware,PostEventActivitiesMiddleware,PostFeedActivitiesMiddleware
}