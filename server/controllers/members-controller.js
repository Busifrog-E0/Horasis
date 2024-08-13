import e from 'express';

import { ReadOneFromMembers, ReadMembers, UpdateMembers, CreateMembers, RemoveMembers, UpdateManyMembers, } from './../databaseControllers/members-databaseController.js';
import { IncrementDiscussions, ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { ObjectId } from 'mongodb';
import { AggregateConnections } from '../databaseControllers/connections-databaseController.js';
import { RemoveNotificationForMember, SendNotificationForMemberInvitation, SendNotificationForMemberJoin, SendNotificationForMemberRequest, SendNotificationForMemberRequestStatus } from './notifications-controller.js';
import { IncrementEvents, ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/members-databaseController.js').MemberData} MemberData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<MemberData>>}
 */
const GetOneFromMembers = async (req, res) => {
    const { MemberId } = req.params;
    const data = await ReadOneFromMembers(MemberId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<MemberData>>>}
 */
const GetMembers = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.EntityId = req.params.EntityId;
    //@ts-ignore
    Filter.MembershipStatus = "Accepted";
    //@ts-ignore
    const data = await ReadMembers(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostMembers = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { EntityId } = req.params;

    const MemberCheck = await ReadMembers({ MemberId: UserId, EntityId, MembershipStatus: "Accepted" }, undefined, 1, undefined);
    if (MemberCheck.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Join", "You have already joined this discussion"));
    }
    const UserDetails = await ReadOneFromUsers(UserId);
    req.body = { ...MemberInit(req.body), MemberId: UserId, EntityId, UserDetails };
    const Entity = req.body.Type === "Discussion" ? await ReadOneFromDiscussions(EntityId) : await ReadOneFromEvents(EntityId);
    if (Entity.Privacy === "Private") {
        req.body.MembershipStatus = "Requested";
    }
    await CreateMembers(req.body);

    if (Entity.Privacy === "Public") {
        req.body.Type === "Discussion" ?
            await IncrementDiscussions({ NoOfMembers: 1 }, EntityId)
            :
            await IncrementEvents({ NoOfMembers: 1 }, EntityId);
        await SendNotificationForMemberJoin(req.body.Type, EntityId, UserId);
        return res.json(true);
    }
    await SendNotificationForMemberRequest(req.body.Type, EntityId, UserId);
    return res.status(244).json(AlertBoxObject("Request Sent", "Request has been sent"));

}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const AcceptJoinRequest = async (req, res) => {
    //@ts-ignore
    const { EntityId, UserId } = req.params;
    const Member = await ReadMembers({ MemberId: UserId, EntityId, MembershipStatus: "Requested" }, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Accept", `User have not requested to join this ${req.body.Type}`));
    }
    await UpdateMembers({ MembershipStatus: "Accepted" }, Member[0].DocId);
    if (req.body.Type === "Discussion") {
        await IncrementDiscussions({ NoOfMembers: 1 }, EntityId);
    }
    if (req.body.Type === "Event") {
        await IncrementEvents({ NoOfMembers: 1 }, EntityId);
    }
    //@ts-ignore
    await SendNotificationForMemberRequestStatus(req.body.Type, EntityId, UserId, "Accepted", req.user.User);
    return res.json(true);
}




/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const InviteMembers = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { EntityId, InviteeId } = req.params;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);

    if (!Member[0].Permissions.CanInviteOthers) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You cannot invite others to this discussion"));
    }

    const Invitee = await ReadMembers({ MemberId: InviteeId, EntityId }, undefined, 1, undefined);

    if (Invitee[0]) {
        if (Invitee[0].MembershipStatus === "Requested") {
            await UpdateMembers({ MembershipStatus: "Accepted" }, Invitee[0].DocId);
            req.body.Type === "Discussion" ?
                await IncrementDiscussions({ NoOfMembers: 1 }, EntityId)
                :
                await IncrementEvents({ NoOfMembers: 1 }, EntityId);
            return res.json(true);
        }
        else if (Invitee[0].MembershipStatus === "Invited") {
            return res.status(444).json(AlertBoxObject("Cannot Invite", "User has already been invited to this discussion"));
        }
        return res.status(444).json(AlertBoxObject("Cannot Invite", "User is already a member of this discussion"));
    }

    const UserDetails = await ReadOneFromUsers(InviteeId);
    req.body = { ...MemberInit(req.body), MemberId: InviteeId, EntityId, UserDetails };
    req.body.MembershipStatus = "Invited";
    await CreateMembers(req.body);
    await SendNotificationForMemberInvitation(req.body.Type, EntityId, InviteeId, UserId);
    return res.json(true);
}
/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const AcceptMemberInvitation = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (Member[0].MembershipStatus === "Accepted") {
        return res.status(444).json(AlertBoxObject("Cannot Accept", "You have already joined this discussion"));
    }
    await UpdateMembers({ MembershipStatus: "Accepted" }, Member[0].DocId);
    req.body.Type === "Discussion" ?
        await IncrementDiscussions({ NoOfMembers: 1 }, EntityId)
        :
        await IncrementEvents({ NoOfMembers: 1 }, EntityId);
    return res.json(true);
}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetJoinRequests = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { Filter, NextId, Limit, OrderBy } = req.query;
    //@ts-ignore
    Filter.MembershipStatus = "Requested";
    //@ts-ignore
    Filter.EntityId = EntityId;
    //@ts-ignore
    const Member = await ReadMembers(Filter, NextId, Limit, OrderBy);
    return res.json(Member);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const GetMembersToInvite = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Limit, OrderBy } = req.query;

    const AggregateArray = [
        {
            $match: {
                $or: [
                    { "UserIds.0": UserId },
                    { "UserIds.1": UserId }
                ]
            }
        },
        { $unwind: "$UserIds" },
        { $match: { UserIds: { $ne: UserId } } },
        {
            $addFields: {
                userObjectId: { $toObjectId: "$UserIds" }
            }
        },
        {
            $lookup: {
                from: "Users",
                localField: "userObjectId",
                foreignField: "_id",
                as: "connectedUserDetails"
            }
        },
        { $unwind: "$connectedUserDetails" },
        {
            $lookup: {
                from: "Members",
                let: { userIds: "$UserIds" },
                pipeline: [
                    { $match: { $expr: { $and: [{ $eq: ["$MemberId", "$$userIds"] }, { $eq: ["$EntityId", EntityId] }] } } }
                ],
                as: "memberCheck"
            }
        },

        // Filter out users who are already members of the discussion
        { $match: { "memberCheck": { $eq: [] } } },

        // Project the final result
        {
            $replaceRoot: {
                "newRoot":
                    "$connectedUserDetails"
            }
        },
        {
            $project: {
                "Password": 0
            }
        }
    ]
    const Users = await AggregateConnections(AggregateArray, NextId, Limit, OrderBy);

    return res.json(Users);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const UpdateMemberPermissions = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (!Member[0].Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Update Permissions", "You are not an admin of this discussion"));
    }
    await Promise.all(Object.keys(req.body).map(async (PermissionArray) => {
        if (req.body[PermissionArray].length > 0) {
            await UpdateManyMembers({ [`Permissions.${PermissionArray}`]: true }, { EntityId, MemberId: { $in: req.body[PermissionArray] } });
        }
    }))
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const RemoveMemberPermissions = async (req, res) => {
    const { EntityId, MemberId } = req.params;
    const { PermissionField } = req.body;
    const Member = await ReadMembers({ MemberId: MemberId, EntityId }, undefined, 1, undefined);
    await UpdateMembers({ [`Permissions.${PermissionField}`]: false }, Member[0].DocId);
    return res.json(true);
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchMembers = async (req, res) => {
    const { MemberId } = req.params;
    await UpdateMembers(req.body, MemberId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const DeleteTempMembers = async (req, res) => {
    const { EntityId, UserId } = req.params;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    await RemoveMembers(Member[0].DocId);
    return res.json(true);
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteMembers = async (req, res) => {
    const { EntityId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot leave", "You are not an member of this discussion"));
    }
    if (req.body.Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        if (Discussion.OrganiserId === UserId) {
            return res.status(444).json(AlertBoxObject("Cannot leave", "Organiser cannot leave the discussion"));
        }
        await IncrementDiscussions({ NoOfMembers: -1 }, EntityId);
    }
    else {
        const Event = await ReadOneFromEvents(EntityId);
        if (Event.OrganiserId === UserId) {
            return res.status(444).json(AlertBoxObject("Cannot leave", "Organiser cannot leave the event"));
        }
        await IncrementEvents({ NoOfMembers: -1 }, EntityId);
    }
    await RemoveMembers(Member[0].DocId);
    return res.json(true);
}


const MemberInit = (Member, IsAdmin = false) => {
    return {
        ...Member,
        MembershipStatus: "Accepted",
        Permissions: PermissionObjectInit(IsAdmin)
    }
}
const PermissionObjectInit = (IsAdmin) => {
    return {
        IsAdmin: IsAdmin,
        CanInviteOthers: IsAdmin,
        CanPostActivity: IsAdmin,
        CanUploadPhoto: IsAdmin,
        CanCreateAlbum: IsAdmin,
        CanUploadVideo: IsAdmin
    }
}

export {
    GetOneFromMembers, GetMembers, PostMembers, PatchMembers, DeleteMembers,
    PermissionObjectInit, InviteMembers, AcceptMemberInvitation, UpdateMemberPermissions, GetJoinRequests,
    AcceptJoinRequest, GetMembersToInvite, DeleteTempMembers,
    RemoveMemberPermissions, MemberInit,

}