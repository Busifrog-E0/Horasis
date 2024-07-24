import { AlertBoxObject } from "../controllers/common";
import { ReadMembers, ReadOneFromMembers } from "../databaseControllers/members-databaseController";

const GetDiscussionsActivitiesMiddleware = async (req, res, next) => {
    const Member = await ReadMembers({ MemberId: req.user.UserId, EntityId: req.params.DiscussionId }, undefined, 1, undefined);
    if (Member[0].Status !== "Accepted") {
        return res.status(444).json(AlertBoxObject("Cannot See Discussion", "You cannot see this discussion"));
    }
    req.query.Filter = {...req.query.Filter , ParentId : req.params.DiscussionId};
    return next();
}

export { 
    GetDiscussionsActivitiesMiddleware
}