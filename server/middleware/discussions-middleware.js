import { AlertBoxObject } from "../controllers/common.js";
import { ReadOneFromDiscussions } from "../databaseControllers/discussions-databaseController.js";
import { ReadMembers, ReadOneFromMembers } from "../databaseControllers/members-databaseController.js";

const GetDiscussionsActivitiesMiddleware = async (req, res, next) => {
    const { EntityId } = req.params;
    const Discussion = await ReadOneFromDiscussions(EntityId);
    if (Discussion.Privacy === "Private") {
        const Member = await ReadMembers({ MemberId: req.user.UserId, EntityId: req.params.EntityId }, undefined, 1, undefined);
        if (Member[0].MembershipStatus !== "Accepted") {
            return res.status(444).json(AlertBoxObject("Cannot See Discussion", "You cannot see this discussion"));
        }
    }
    req.query.Filter = {...req.query.Filter , EntityId : req.params.EntityId};
    return next();
}

const PostDiscussionActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Discussion", EntityId: req.params.EntityId, ...req.body };
    return next();
};


export { 
    GetDiscussionsActivitiesMiddleware,
    PostDiscussionActivitiesMiddleware,
    
}