const GetFeedActivitiesMiddleware = (req, res, next) => {
    if (!req.query.Type) {
        req.query = { Type: "Feed", ...req.query }
    };
    return next();
}

const GetEventActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { Type: "Event", ...req.query.Filter };
    return next();
}



const PostFeedActivitiesMiddleware = (req, res, next) => {
    if(!req.body.Type){
        req.body = { Type: "Feed", EntityId: "Feed", ...req.body };
    }
    return next();
}

const PostEventActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Event", ...req.body };
    return next();
}


const GetUserActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { UserId: req.params.UserId, ...req.query.Filter };
    return next();
}

const GetMentionedActivitiesMiddleware = (req, res, next) => {
    req.query.Filter = { Mentions: { $elemMatch: { UserId: req.params.UserId } }, ...req.query.Filter };
    return next();
}

const PostActivitiesLikeMiddleware = (req, res, next) => {
    req.body = { ...req.body, Type: 'Activity' };
    return next();
}

const InsertActivityTypeMiddleware = (req, res, next) => {
    req.body = { ...req.body, Type: 'Activity' };
    return next();
}

export {
    GetFeedActivitiesMiddleware, GetEventActivitiesMiddleware, PostEventActivitiesMiddleware, PostFeedActivitiesMiddleware,
    GetUserActivitiesMiddleware, GetMentionedActivitiesMiddleware, PostActivitiesLikeMiddleware, InsertActivityTypeMiddleware

}