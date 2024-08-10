import { AlertBoxObject } from "../controllers/common";
import { ReadOneFromEvents } from "../databaseControllers/events-databaseController";
import { ReadMembers } from "../databaseControllers/members-databaseController";

const InsertEventTypeMiddleware = async (req, res, next) => {
    req.body.Type = "Event";
    return next();
}

const PostEventActivitiesMiddleware = (req, res, next) => {
    req.body = { Type: "Event", EntityId: req.params.EntityId, ...req.body };
    return next();
};

const GetEventsActivitiesMiddleware = async (req, res, next) => {
    const { EntityId } = req.params;
    const Event = await ReadOneFromEvents(EntityId);
    if (Event.Privacy === "Private") {
        const Member = await ReadMembers({ MemberId: req.user.UserId, EntityId: req.params.EntityId }, undefined, 1, undefined);
        if (Member[0].MembershipStatus !== "Accepted") {
            return res.status(444).json(AlertBoxObject("Cannot See Event", "You cannot see this discussion"));
        }
    }
    req.query.Filter = { ...req.query.Filter, EntityId: req.params.EntityId };
    return next();
}
export {
    PostEventActivitiesMiddleware, InsertEventTypeMiddleware,
    GetEventsActivitiesMiddleware
}