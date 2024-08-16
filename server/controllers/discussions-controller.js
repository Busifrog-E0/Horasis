import e from 'express';

import { ReadOneFromDiscussions, ReadDiscussions, UpdateDiscussions, CreateDiscussions, RemoveDiscussions, AggregateDiscussions, } from './../databaseControllers/discussions-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { PermissionObjectInit } from './members-controller.js';

import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
import { MemberInit } from './members-controller.js';
import { AlertBoxObject } from './common.js';
/**
 * @typedef {import('./../databaseControllers/discussions-databaseController.js').DiscussionData} DiscussionData 
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
        Filter["DiscussionName"] = { $regex: Keyword, $options: 'i' };
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
    const { OrganiserId } = req.body;
    const UserDetails = await ReadOneFromUsers(OrganiserId);
    req.body = DiscussionInit(req.body);
    const DiscussionId = await CreateDiscussions({ ...req.body, UserDetails });
    const Member = MemberInit({ MemberId: OrganiserId, EntityId: DiscussionId, UserDetails }, true);
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
    const { EntityId } = req.params;
    const Member = (await ReadMembers({ EntityId, MemberId: UserId }, undefined, 1, undefined))[0];
    if (!Member.Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Edit", "You are not an admin of this discussion"))
    }
    await UpdateDiscussions(req.body, EntityId);
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
    await RemoveDiscussions(DiscussionId);
    return res.json(true);
}

const DiscussionInit = (Discussion) => {
    return {
        ...Discussion,
        NoOfMembers: 1,
        MemberPermissions: {
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
    const DiscussionMemberObject = { IsMember: false, Permissions: {} };
    const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
    if (Member.length > 0) {
        for (const PermissionField in Discussion.MemberPermissions) {
            console.log(PermissionField)
            if (Discussion.MemberPermissions[PermissionField] === true) {
                DiscussionMemberObject.Permissions[PermissionField] = true
            }
            else {
                DiscussionMemberObject.Permissions[PermissionField] = Member[0].Permissions[PermissionField]
            }
        }
        DiscussionMemberObject.Permissions["IsAdmin"] = Member[0].Permissions["IsAdmin"];
        DiscussionMemberObject.IsMember = Member[0].MembershipStatus === "Accepted";
        DiscussionMemberObject.MembershipStatus = Member[0].MembershipStatus
    }
    const Save = await ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined);
    const IsSaved = Save.length > 0;
    return { ...Discussion, ...DiscussionMemberObject, IsSaved }
}

export {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
    GetUserDiscussions, GetInvitedDiscussions, GetPublicDiscussions
}