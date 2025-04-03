import e from 'express';

import { ReadOneFromMembers, ReadMembers, UpdateMembers, CreateMembers, RemoveMembers, UpdateManyMembers, } from './../databaseControllers/members-databaseController.js';
import { IncrementDiscussions, ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers, } from '../databaseControllers/users-databaseController.js';
import { AggregateConnections } from '../databaseControllers/connections-databaseController.js';
import { SendNotificationForMemberInvitation, SendNotificationForMemberJoin, SendNotificationForMemberRequest, SendNotificationForMemberRequestStatus } from './notifications-controller.js';
import { IncrementEvents, ReadOneFromEvents, } from '../databaseControllers/events-databaseController.js';
import { IncrementPodcasts, ReadOneFromPodcasts } from '../databaseControllers/podcasts-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/members-databaseController.js').MemberData} MemberData 
 */

/**
 * @typedef {import('../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {import('../databaseControllers/discussions-databaseController.js').DiscussionData} DiscussionData
 */

/**
 * @typedef {import('../databaseControllers/events-databaseController.js').EventData} EventData
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
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter.$or = [
            { "UserDetails.FullName": { $regex: Keyword, $options: 'i' } },
            { "UserDetails.Username": { $regex: Keyword, $options: 'i' } },
        ];
    }
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
    const { Type } = req.body;

    const MemberCheck = await ReadMembers({ MemberId: UserId, EntityId, MembershipStatus: "Accepted" }, undefined, 1, undefined);
    if (MemberCheck.length > 0) {
        return res.status(444).json(AlertBoxObject("Cannot Join", "You have already joined this discussion"));
    }

    const UserDetails = await ReadOneFromUsers(UserId);;
    const Entity = Type === "Discussion" ? await ReadOneFromDiscussions(EntityId) :
        (Type === "Event" ? await ReadOneFromEvents(EntityId) : await ReadOneFromPodcasts(EntityId));

    if (Type === "Event" && Entity.Capacity && Entity.Capacity <= Entity.NoOfMembers) {
        return res.status(444).json(AlertBoxObject("Cannot Join", "This event is full"));
    }
    
    if (Entity.Privacy === "Private") {
        req.body = MemberInit({ MemberId: UserId, EntityId, UserDetails,Type }, "Requested")
        await Promise.all([
            SendNotificationForMemberRequest(Type, EntityId, UserId),
            CreateMembers(req.body)
        ])
        return res.status(244).json(AlertBoxObject("Request Sent", "Request has been sent"));
    }
    else {
        req.body = MemberInit({ MemberId: UserId, EntityId, UserDetails,Type }, "Accepted");
        await Promise.all([
            SendNotificationForMemberJoin(Type, EntityId, UserId),
            CreateMembers({ ...req.body, MemberId: UserId, EntityId, UserDetails }),
            Type === "Discussion" ? IncrementDiscussions({ NoOfMembers: 1 }, EntityId) : (
                Type === "Event" ? IncrementEvents({ NoOfMembers: 1 }, EntityId) : IncrementPodcasts({ NoOfMembers: 1 }, EntityId))
        ])
        return res.json(true);
    }
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
    if(req.body.Type === "Podcast"){
        await IncrementPodcasts({ NoOfMembers: 1 }, EntityId);
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
    const { Type } = req.body;
    const [Member] = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);

    if (!Member.Permissions.CanInviteOthers) {
        return res.status(444).json(AlertBoxObject("Cannot Invite", "You cannot invite others to this discussion"));
    }
    const Entity = Type === "Discussion" ? await ReadOneFromDiscussions(EntityId) :
        (Type === "Event" ? await ReadOneFromEvents(EntityId) : await ReadOneFromPodcasts(EntityId));
    
    if (Type === "Event" && Entity.Capacity && Entity.Capacity <= Entity.NoOfMembers) { 
        return res.status(444).json(AlertBoxObject("Cannot Invite", "This event is full"));
    }
    
    const [Invitee] = await ReadMembers({ MemberId: InviteeId, EntityId }, undefined, 1, undefined);

    if (Invitee) {
        switch (Invitee.MembershipStatus) {
            case "Requested":
                await UpdateMembers({ MembershipStatus: "Accepted" }, Invitee.DocId);
                req.body.Type === "Discussion" ?
                    await IncrementDiscussions({ NoOfMembers: 1 }, EntityId)
                    :
                   ( req.body.Type === "Event" ? await IncrementEvents({ NoOfMembers: 1 }, EntityId) : await IncrementPodcasts({ NoOfMembers: 1 }, EntityId));
                return res.json(true);

            case "Invited":
                return res.status(444).json(AlertBoxObject("Cannot Invite", "User has already been invited to this discussion"));

            default:
                return res.status(444).json(AlertBoxObject("Cannot Invite", "User is already a member of this discussion"));

        }
    }

    const UserDetails = await ReadOneFromUsers(InviteeId);
    req.body = MemberInit({ MemberId: InviteeId, EntityId, UserDetails ,Type }, "Invited");
    await Promise.all([
        await CreateMembers(req.body),
        await SendNotificationForMemberInvitation(Type, EntityId, InviteeId, UserId)
    ])
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
    const [Member] = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (Member.MembershipStatus === "Accepted") {
        return res.status(444).json(AlertBoxObject("Cannot Accept", "You have already joined this discussion"));
    }
    await UpdateMembers({ MembershipStatus: "Accepted" }, Member.DocId);
    req.body.Type === "Discussion" ?
        await IncrementDiscussions({ NoOfMembers: 1 }, EntityId)
        :
        (req.body.Type === "Event" ? await IncrementEvents({ NoOfMembers: 1 }, EntityId) : await IncrementPodcasts({ NoOfMembers: 1 }, EntityId));
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
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter.$or = [
            { "UserDetails.FullName": { $regex: Keyword, $options: 'i' } },
            { "UserDetails.Username": { $regex: Keyword, $options: 'i' } },
        ];
    }
    const AggregateArray = [
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { "UserIds.0": UserId },
                            { "UserIds.1": UserId }
                        ]
                    },
                    //@ts-ignore
                    Filter ? Filter : {},]
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
    const { PermissionField, UserIds } = req.body;
    const Member = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (!Member[0].Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Update Permissions", "You are not an admin of this discussion"));
    }

    await UpdateManyMembers({ [`Permissions.${PermissionField}`]: true }, { EntityId, MemberId: { $in: UserIds } });
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
    //@ts-ignore
    const { UserId } = req.user
    const { PermissionField } = req.body;
    const [Entity, Member, User] = await Promise.all([
        req.body.Type === "Discussion" ?
            ReadOneFromDiscussions(EntityId)
            :
            ( req.body.Type === "Event" ? ReadOneFromEvents(EntityId) : ReadOneFromPodcasts(EntityId)),
        ReadMembers({ MemberId: MemberId, EntityId }, undefined, 1, undefined),
        ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined)
    ]);
    if (Entity.OrganiserId === MemberId) {
        return res.status(444).json(AlertBoxObject("Cannot Update Permissions", "You cannot remove permissions from the organiser"));
    }
    if (!User[0].Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Update Permissions", "You are not an admin of this discussion"));
    }
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
    const [Member] = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
    if (!Member) {
        return res.status(444).json(AlertBoxObject("Cannot leave", "You are not an member of this discussion"));
    }
    switch(Member.Type) {
        case "Discussion": {
            const Discussion = await ReadOneFromDiscussions(EntityId);
            if (Discussion.OrganiserId === UserId) {
                return res.status(444).json(AlertBoxObject("Cannot leave", "Organiser cannot leave the discussion"));
            }
            await IncrementDiscussions({ NoOfMembers: -1 }, EntityId);
            break;
        }
        case "Event": {
            const Event = await ReadOneFromEvents(EntityId);
            if (Event.OrganiserId === UserId) {
                return res.status(444).json(AlertBoxObject("Cannot leave", "Organiser cannot leave the event"));
            }
            await IncrementEvents({ NoOfMembers: -1 }, EntityId);
            break;
         }
        case "Podcast": {
            const Podcast = await ReadOneFromPodcasts(EntityId);
            if (Podcast.OrganiserId === UserId) {
                return res.status(444).json(AlertBoxObject("Cannot leave", "Organiser cannot leave the podcast"));
            }
            await IncrementPodcasts({ NoOfMembers: -1 }, EntityId);
            break;
        }  
    }
    await RemoveMembers(Member.DocId);
    return res.json(true);
}

/**\
 * @param {string} EntityId
 */
const DeleteMembersOfEntity = async (EntityId) => {
    const Members = await ReadMembers({ EntityId: EntityId }, undefined, -1, undefined);
    return await Promise.all(Members.map((Member) => RemoveMembers(Member.DocId)));
}

/**
 * 
 * @param {MemberData | undefined} Member 
 * @param {DiscussionData|EventData} Entity 
 */
const GetPermissionOfMember = (Member, Entity) => {
    const MembershipObject = { IsMember: false, Permissions: {} };
    if (Member) {
        for (const PermissionField in Entity.MemberPermissions) {
            if (Entity.MemberPermissions[PermissionField] === true) {
                MembershipObject.Permissions[PermissionField] = true;
            }
            else {
                MembershipObject.Permissions[PermissionField] = Member.Permissions[PermissionField];
            }
        }
        MembershipObject.IsMember = (Member.MembershipStatus === "Accepted");
        MembershipObject.MembershipStatus = Member.MembershipStatus;
    }
    return { ...Entity, ...MembershipObject };
}

/**
 * 
 * @param {object} Data
 * @param {string} Data.EntityId 
 * @param {string} Data.MemberId 
 * @param {UserData} Data.UserDetails
 * @param {"Discussion"|"Event"|"Podcast"} Data.Type
 * @param {"Accepted"|"Invited"|"Requested"} MembershipStatus 
 * @param {boolean} IsAdmin 
 * @returns 
 */
const MemberInit = (Data, MembershipStatus = "Accepted", IsAdmin = false) => {
    return {
        ...Data,
        MembershipStatus,
        IsSpeaker: false,
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
    RemoveMemberPermissions, MemberInit, DeleteMembersOfEntity, GetPermissionOfMember

}