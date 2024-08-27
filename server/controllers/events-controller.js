import e from 'express';

import { ReadOneFromEvents, ReadEvents, UpdateEvents, CreateEvents, RemoveEvents, AggregateEvents, } from './../databaseControllers/events-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { GetPermissionOfMember, MemberInit } from './members-controller.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { RemoveNotificationForEntity } from './notifications-controller.js';
import { AlertBoxObject } from './common.js';
import { DetectLanguage } from './translations-controller.js';
import { CheckIfUserWithMailExists } from './users-controller.js';
import { ReadInvitations } from '../databaseControllers/invitations-databaseController.js';
import { ReadSpeakers } from '../databaseControllers/speakers-databaseController.js';

/**
 * @typedef {import('./../databaseControllers/events-databaseController.js').EventData} EventData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<EventData>>}
 */
const GetOneFromEvents = async (req, res) => {
    const { EventId } = req.params;
    const Event = await ReadOneFromEvents(EventId);
    //@ts-ignore
    const data = await SetEventDataForGet(Event, req.user.UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<EventData>>>}
 */
const GetEvents = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter["EventName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const Events = await ReadEvents(Filter, NextId, Limit, OrderBy);
    // @ts-ignore
    const data = await Promise.all(Events.map(async Event => await SetEventDataForGet(Event, req.user.UserId)));
    return res.json(data);
}

/** 
 * @param { e.Request } req
 * @param { e.Response } res
 * @returns
 */
const GetUserEvents = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["EventName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { eventIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$eventIdString"] }
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
    const Events = await AggregateEvents(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Events.map(async Event => await SetEventDataForGet(Event, UserId)));
    return res.json(data);
}

const GetInvitedEvents = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter["EventName"] = { $regex: Keyword, $options: 'i' };
    }
    // @ts-ignore
    const AggregateArray = [
        {
            $lookup: {
                from: "Members",
                let: { eventIdString: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$EntityId", "$$eventIdString"] }
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
    const Events = await AggregateEvents(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Events.map(async Event => await SetEventDataForGet(Event, UserId)))
    return res.json(data);
}

const GetPublicEvents = (req, res) => {
    const { Filter, NextId, Keyword, Limit, OrderBy } = req.query;
    Filter.Privacy = "Public";
    // @ts-ignore
    const data = ReadEvents(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostEvents = async (req, res) => {
    // @ts-ignore
    const { UserId: OrganiserId } = req.user;
    const UserDetails = await ReadOneFromUsers(OrganiserId);
    req.body = EventInit(req.body);
    const EventId = await CreateEvents({ ...req.body, UserDetails, OrganiserId });
    const Member = MemberInit({ MemberId: OrganiserId, EntityId: EventId, UserDetails }, "Accepted", true);
    await CreateMembers(Member);
    return res.json(EventId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchEvents = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user
    const { EventId } = req.params;
    const [Member] = await ReadMembers({ EntityId: EventId, MemberId: UserId }, undefined, 1, undefined);
    if (!Member.Permissions.IsAdmin) {
        return res.status(444).json(AlertBoxObject("Cannot Edit", "You are not an admin of this discussion"))
    }
    if (req.body.Description) {
        req.body.OriginalLanguage = await DetectLanguage(req.body.Description);
        req.body.Languages = {};
    }
    await UpdateEvents(req.body, EventId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteEvents = async (req, res) => {
    const { EventId } = req.params;
    await RemoveEvents(EventId);
    await RemoveNotificationForEntity(EventId);
    return res.json(true);
}

/**
 * 
 * @param {EventData} Event 
 * @param {string} UserId 
 * @returns 
 */
const SetEventDataForGet = async (Event, UserId) => {
    const [Member, [Speaker]] = await Promise.all([
        ReadMembers({ MemberId: UserId, EntityId: Event.DocId }, undefined, 1, undefined),
        ReadSpeakers({ SpeakerId: UserId, EventId: Event.DocId }, undefined, 1, undefined)
    ]);
    //@ts-ignore
    Event.SpeakerStatus = Speaker ? Speaker.MembershipStatus : "None";
    //@ts-ignore
    Event = GetPermissionOfMember(Member[0], Event);

    return Event;
}

/**
 * 
 * @param {string} Email 
 * @param {"Speaker"|"Member"} Type 
 * @returns 
 */
const CheckIfMailAvailableToInviteInEvent = async (Email, Type) => {
    switch (Type) {
        case "Speaker":
            const [SpeakerInvitation] = await ReadInvitations({ Email }, undefined, 1, undefined);
            if (SpeakerInvitation && SpeakerInvitation.OnCreate.some(object => object.ActionType === "Event-Invite-Speaker")) {
                return AlertBoxObject("Already Invited", "User with this email has already been invited")
            }
            break;
        case "Member":
            const [MemberInvitation] = await ReadInvitations({ Email }, undefined, 1, undefined);
            if (MemberInvitation && MemberInvitation.OnCreate.some(object => object.ActionType === "Event-Invite-Member")) {
                return AlertBoxObject("Already Invited", "User with this email has already been invited")
            }
            break;
        default:
            break;
    }
    return true;
}

const EventInit = (Event) => {
    return {
        ...Event,
        NoOfMembers: 1,
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


export {
    GetOneFromEvents, GetEvents, PostEvents, PatchEvents, DeleteEvents,
    GetUserEvents, GetInvitedEvents, SetEventDataForGet, CheckIfMailAvailableToInviteInEvent,
    GetPublicEvents
}