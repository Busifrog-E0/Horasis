import e from 'express';

import { ReadOneFromDiscussions, ReadDiscussions, UpdateDiscussions, CreateDiscussions, RemoveDiscussions, AggregateDiscussions, } from './../databaseControllers/discussions-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers, ReadMembers, } from '../databaseControllers/members-databaseController.js';
import { DeleteMembersOfEntity, GetPermissionOfMember, MemberInit } from './members-controller.js';
import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
import { AlertBoxObject } from './common.js';
import { DetectLanguage } from './translations-controller.js';
import { RemoveNotificationForEntity } from './notifications-controller.js';
/**
 * @typedef {import('./../databaseControllers/discussions-databaseController.js').DiscussionData} DiscussionData 
 */

/**
 * @typedef {import('../databaseControllers/members-databaseController.js').PermissionData} PermissionData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<DiscussionData>>}
 */
const GetOneFromDiscussions = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { DiscussionId } = req.params;
    const Discussion = await ReadOneFromDiscussions(DiscussionId);
    const data = await SetDiscussionDataForGet(Discussion, UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<DiscussionData>>>}
 */
const GetDiscussions = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["$or"] = [
            { "DiscussionName": { $regex: Keyword, $options: 'i' } },
            { "Tags.TagName": { $regex: Keyword, $options: 'i' } }
        ]
    }
    // @ts-ignore
    const Discussions = await ReadDiscussions(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Discussions.map(async Discussion => await SetDiscussionDataForGet(Discussion, UserId)))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserDiscussions = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["DiscussionName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { discussionIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$discussionIdString"] }
                                ]
                            }
                        }
                    }
                ],
                as: "Member"
            }
        },
        { $unwind: "$Member" },
        {
            $match: {
                // @ts-ignore
                ...Filter,
                "Member.MemberId": UserId,
                "Member.MembershipStatus": "Accepted"
            }
        },
        { $project: { Member: 0 } }
    ]
    const Discussions = await AggregateDiscussions(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Discussions.map(async Discussion => await SetDiscussionDataForGet(Discussion, UserId)))
    return res.json(data);
}

const GetInvitedDiscussions = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["DiscussionName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { discussionIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$discussionIdString"] }
                                ]
                            }
                        }
                    }
                ],
                as: "Member"
            }
        },
        { $unwind: "$Member" },
        {
            $match: {
                ...Filter,
                "Member.MemberId": UserId,
                "Member.MembershipStatus": "Invited"
            }
        },
        { $project: { Member: 0 } }
    ]
    const Discussions = await AggregateDiscussions(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Discussions.map(async Discussion => await SetDiscussionDataForGet(Discussion, UserId)));
    return res.json(data);
}

const GetPublicDiscussions = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.Privacy = "Public";
    // @ts-ignore
    const data = await ReadDiscussions(Filter, NextId, Limit, OrderBy);
    return res.json(data)
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostDiscussions = async (req, res) => {
    // @ts-ignore
    const { UserId: OrganiserId } = req.user;
    const [UserDetails, OriginalLanguage] = await Promise.all([
        ReadOneFromUsers(OrganiserId),
        DetectLanguage(req.body.Description)
    ])
    req.body = DiscussionInit(req.body);
    req.body.OriginalLanguage = OriginalLanguage;
    const DiscussionId = await CreateDiscussions({ ...req.body });
    const Member = MemberInit({ MemberId: OrganiserId, EntityId: DiscussionId, UserDetails, Type: "Discussion" }, "Accepted", true);
    await CreateMembers(Member);
    return res.json(DiscussionId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchDiscussions = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user
    const { DiscussionId } = req.params;
    const [Member] = await ReadMembers({ EntityId: DiscussionId, MemberId: UserId }, undefined, 1, undefined);
    if (!Member.Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Edit", "You are not an admin of this discussion"))
    }
    if (req.body.Description) {
        req.body.OriginalLanguage = await DetectLanguage(req.body.Description);
        req.body.Languages = {};
    }
    await UpdateDiscussions(req.body, DiscussionId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteDiscussions = async (req, res) => {
    const { DiscussionId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const Discussion = await ReadOneFromDiscussions(DiscussionId);
    if (Discussion.OrganiserId !== UserId) {
        return res.status(444).json(AlertBoxObject("Cannot Delete", "You are not the organiser of this discussion"))
    }
    await Promise.all([
        RemoveDiscussions(DiscussionId),
        DeleteMembersOfEntity(DiscussionId),
        RemoveNotificationForEntity(DiscussionId)
    ])
    return res.json(true);
}

const DiscussionInit = (Discussion) => {
    return {
        ...Discussion,
        NoOfMembers: 1,
        NoOfActivities: 0,
        MemberPermissions: {
            IsAdmin: false,
            CanPostActivity: false,
            CanInviteOthers: false,
            CanUploadPhoto: false,
            CanCreateAlbum: false,
            CanUploadVideo: false
        }
    }
}

/**
 * 
 * @param {DiscussionData} Discussion 
 * @param {string} UserId 
 * @returns 
 */
const SetDiscussionDataForGet = async (Discussion, UserId) => {
    const [Member, UserDetails, Save] = await Promise.all([
        ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined),
        ReadOneFromUsers(Discussion.OrganiserId),
        ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined)
    ])
    //@ts-ignore
    Discussion = GetPermissionOfMember(Member[0], Discussion);
    const HasSaved = Save.length > 0;
    return { ...Discussion, HasSaved, UserDetails }
}

export {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
    GetUserDiscussions, GetInvitedDiscussions, GetPublicDiscussions, SetDiscussionDataForGet
}