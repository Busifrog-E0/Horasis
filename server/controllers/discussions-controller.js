import e from 'express';

import { ReadOneFromDiscussions, ReadDiscussions, UpdateDiscussions, CreateDiscussions, RemoveDiscussions, AggregateDiscussions, } from './../databaseControllers/discussions-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { PermissionObjectInit } from './members-controller.js';
import { ObjectId } from 'mongodb';
import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
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
    const DiscussionMemberObject = { IsMember: false, Permissions: {} };
    const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
    if (Member.length > 0) {
        DiscussionMemberObject.IsMember = Member[0].MembershipStatus === "Accepted";
        DiscussionMemberObject.Permissions = Member[0].Permissions
        DiscussionMemberObject.MembershipStatus = Member[0].MembershipStatus
    }
    const Save = await ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined);
    const IsSaved = Save.length > 0;
    const data = { ...Discussion, ...DiscussionMemberObject,IsSaved };
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
    const data = await Promise.all(Discussions.map(async Discussion => {
        const DiscussionMemberObject = { IsMember: false, };
        const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
        if (Member.length > 0) {
            DiscussionMemberObject.IsMember = Member[0].MembershipStatus === "Accepted";
            DiscussionMemberObject.Permissions = Member[0].Permissions
            DiscussionMemberObject.MembershipStatus = Member[0].MembershipStatus
        }
        const Save = await ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined);
        const IsSaved = Save.length > 0;
        return { ...Discussion, ...DiscussionMemberObject,IsSaved }
    }))
    return res.json(data);
}

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
        {
            $match: {
                ...Filter,
                "Member.MemberId": UserId,
                "Member.MembershipStatus": "Accepted"
            }
        }
    ]
    if (NextId) {
        const [Index, nextId] = NextId.split('--');
        AggregateArray.push({
            $match: {
                $or: [
                    { Index: { $lt: Index } },
                    {
                        $and: [
                            { Index: Index },
                            { _id: { $lt: new ObjectId(nextId) } }
                        ]
                    }
                ]
            }
        });
    }

    AggregateArray.push(
        { $sort: { Index: -1, _id: -1 } },
        { $limit: Limit },
        { $project: { Member: 0 } }
    );
    const Discussions = await AggregateDiscussions(AggregateArray);
    const data = await Promise.all(Discussions.map(async Discussion => {
        const DiscussionMemberObject = { IsMember: false, };
        const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
        if (Member.length > 0) {
            DiscussionMemberObject.IsMember = Member[0].MembershipStatus === "Accepted";
            DiscussionMemberObject.Permissions = Member[0].Permissions
            DiscussionMemberObject.MembershipStatus = Member[0].MembershipStatus
        }
        const Save = await ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined);
        const IsSaved = Save.length > 0;
        return { ...Discussion, ...DiscussionMemberObject, IsSaved }
    }))
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
        {
            $match: {
                ...Filter,
                "Member.MemberId": UserId,
                "Member.MembershipStatus": "Invited"
            }
        }
    ]
    if (NextId) {
        const [Index, nextId] = NextId.split('--');
        AggregateArray.push({
            $match: {
                $or: [
                    { Index: { $lt: Index } },
                    {
                        $and: [
                            { Index: Index },
                            { _id: { $lt: new ObjectId(nextId) } }
                        ]
                    }
                ]
            }
        });
    }

    AggregateArray.push(
        { $sort: { Index: -1, _id: -1 } },
        { $limit: Limit },
        { $project: { Member: 0 } }
    );
    const Discussions = await AggregateDiscussions(AggregateArray);
    const data = await Promise.all(Discussions.map(async Discussion => {
        const DiscussionMemberObject = { IsMember: false, };
        const Member = await ReadMembers({ MemberId: UserId, EntityId: Discussion.DocId }, undefined, 1, undefined);
        if (Member.length > 0) {
            DiscussionMemberObject.IsMember = Member[0].MembershipStatus === "Accepted";
            DiscussionMemberObject.Permissions = Member[0].Permissions
            DiscussionMemberObject.MembershipStatus = Member[0].MembershipStatus
        }
        const Save = await ReadSaves({ EntityId: Discussion.DocId, UserId }, undefined, 1, undefined);
        const IsSaved = Save.length > 0;
        return { ...Discussion, ...DiscussionMemberObject, IsSaved }
    }))
    return res.json(data);
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
    const Permissions = PermissionObjectInit(true);
    req.body = DiscussionInit(req.body);
    const DiscussionId = await CreateDiscussions({ ...req.body, UserDetails });
    await CreateMembers({ MemberId: OrganiserId, EntityId: DiscussionId, UserDetails, Permissions, MembershipStatus: "Accepted" })
    return res.json(DiscussionId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchDiscussions = async (req, res) => {
    const { DiscussionId } = req.params;
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
    await RemoveDiscussions(DiscussionId);
    return res.json(true);
}

const DiscussionInit = (Discussion) => {
    return {
        ...Discussion,
        NoOfMembers: 1
    }
}


export {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
    GetUserDiscussions,GetInvitedDiscussions
}