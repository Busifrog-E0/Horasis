import e from 'express';
import { ReadOneFromPodcasts, ReadPodcasts, UpdatePodcasts, CreatePodcasts, RemovePodcasts, AggregatePodcasts, } from './../databaseControllers/podcasts-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { CreateMembers, ReadMembers, } from '../databaseControllers/members-databaseController.js';
import { DeleteMembersOfEntity, GetPermissionOfMember, MemberInit } from './members-controller.js';
import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
import { AlertBoxObject } from './common.js';
import { DetectLanguage } from './translations-controller.js';
import { RemoveNotificationForEntity } from './notifications-controller.js';
/**
 * @typedef {import('./../databaseControllers/podcasts-databaseController.js').PodcastData} PodcastData 
 */

/**
 * @typedef {import('../databaseControllers/members-databaseController.js').PermissionData} PermissionData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<PodcastData>>}
 */
const GetOneFromPodcasts = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { PodcastId } = req.params;
    const Podcast = await ReadOneFromPodcasts(PodcastId);
    const data = await SetPodcastDataForGet(Podcast, UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<PodcastData>>>}
 */
const GetPodcasts = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["PodcastName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const Podcasts = await ReadPodcasts(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Podcasts.map(async Podcast => await SetPodcastDataForGet(Podcast, UserId)))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserPodcasts = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["PodcastName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { podcastIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$podcastIdString"] }
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
    const Podcasts = await AggregatePodcasts(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Podcasts.map(async Podcast => await SetPodcastDataForGet(Podcast, UserId)))
    return res.json(data);
}

const GetInvitedPodcasts = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["PodcastName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { podcastIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$podcastIdString"] }
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
    const Podcasts = await AggregatePodcasts(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Podcasts.map(async Podcast => await SetPodcastDataForGet(Podcast, UserId)));
    return res.json(data);
}

const GetPublicPodcasts = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.Privacy = "Public";
    // @ts-ignore
    const data = await ReadPodcasts(Filter, NextId, Limit, OrderBy);
    return res.json(data)
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostPodcasts = async (req, res) => {
    const { OrganiserId } = req.body;
    const [UserDetails, OriginalLanguage] = await Promise.all([
        ReadOneFromUsers(OrganiserId),
        DetectLanguage(req.body.Description)
    ])
    req.body = PodcastInit(req.body);
    req.body.OriginalLanguage = OriginalLanguage;
    const PodcastId = await CreatePodcasts({ ...req.body });
    const Member = MemberInit({ MemberId: OrganiserId, EntityId: PodcastId, UserDetails }, "Accepted", true);
    await CreateMembers(Member);
    return res.json(PodcastId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchPodcasts = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user
    const { PodcastId } = req.params;
    const [Member] = await ReadMembers({ EntityId: PodcastId, MemberId: UserId }, undefined, 1, undefined);
    if (!Member.Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Edit", "You are not an admin of this podcast"))
    }
    if (req.body.Description) {
        req.body.OriginalLanguage = await DetectLanguage(req.body.Description);
        req.body.Languages = {};
    }
    await UpdatePodcasts(req.body, PodcastId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeletePodcasts = async (req, res) => {
    const { PodcastId } = req.params;
    await Promise.all([
        RemovePodcasts(PodcastId),
        DeleteMembersOfEntity(PodcastId),
        RemoveNotificationForEntity(PodcastId)
    ])
    return res.json(true);
}

const PodcastInit = (Podcast) => {
    return {
        ...Podcast,
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
 * @param {PodcastData} Podcast 
 * @param {string} UserId 
 * @returns 
 */
const SetPodcastDataForGet = async (Podcast, UserId) => {
    const [Member, UserDetails, Save] = await Promise.all([
        ReadMembers({ MemberId: UserId, EntityId: Podcast.DocId }, undefined, 1, undefined),
        ReadOneFromUsers(Podcast.OrganiserId),
        ReadSaves({ EntityId: Podcast.DocId, UserId }, undefined, 1, undefined)
    ])
    //@ts-ignore
    Podcast = GetPermissionOfMember(Member[0], Podcast);
    const HasSaved = Save.length > 0;
    return { ...Podcast, HasSaved, UserDetails }
}

export {
    GetOneFromPodcasts, GetPodcasts, PostPodcasts, PatchPodcasts, DeletePodcasts,
    GetUserPodcasts, GetInvitedPodcasts, GetPublicPodcasts, SetPodcastDataForGet
}