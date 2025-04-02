import e from 'express';

import { ReadOneFromSpeakers, ReadSpeakers, UpdateSpeakers, CreateSpeakers, RemoveSpeakers, } from './../databaseControllers/speakers-databaseController.js';
import { AlertBoxObject } from './common.js';
import { AggregateUsers, ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { MemberInit } from './members-controller.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { IncrementEvents, PullArrayEvents, PushArrayEvents, ReadOneFromEvents, UpdateEvents } from '../databaseControllers/events-databaseController.js';
import { RemoveNotificationForSpeaker, SendNotificationForSpeaker } from './notifications-controller.js';
import { ObjectId } from 'mongodb';
import { SendSpeakerInviteEmail } from './emails-controller.js';
/**
 * @typedef {import('./../databaseControllers/speakers-databaseController.js').SpeakerData} SpeakerData 
 */

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<SpeakerData>>}
 */
const GetOneFromSpeakers = async (req, res) => {
    const { SpeakerId } = req.params;
    const data = await ReadOneFromSpeakers(SpeakerId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<SpeakerData>>>}
 */
const GetSpeakerstoInvite = async (req, res) => {
    const { EventId } = req.params;
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        // @ts-ignore
        Filter.$or = [
            { "FullName": { $regex: Keyword, $options: 'i' } },
            { "Username": { $regex: Keyword, $options: 'i' } },
        ]
    }
    const AggregateArray = [
        {// @ts-ignore
            $match: { ...Filter }
        },
        {
            $lookup: {
                from: "Speakers",
                let: { userId: { $toString: "$_id" } },
                pipeline: [
                    { $match: { $expr: { $and: [{ $eq: ["$EventId", EventId] }, { $eq: ["$SpeakerId", "$$userId"] }] } } }
                ],
                as: "Speakers"
            }
        },
        {
            $match: { Speakers: { $eq: [] } }
        },
    ]
    // @ts-ignore
    const data = await AggregateUsers(AggregateArray, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostSpeakers = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user
    const { EventId, SpeakerId } = req.params;
    const { Agenda } = req.body;
    const [Speaker] = await ReadSpeakers({ SpeakerId, EventId }, undefined, 1, undefined);
    if (Speaker) {
        return res.status(444).json(AlertBoxObject("Already Invited", "You have already invited this user."));
    }
    const Event = await ReadOneFromEvents(EventId);
    const UserDetails = await ReadOneFromUsers(SpeakerId);
    const { Agenda: AgendaData } = Event;
    const updatedAgenda = AgendaData.map(item => {
        if (item.AgendaId === Agenda.AgendaId) {
            return { ...item, SpeakerData: { SpeakerId, UserDetails } }
        }
        return item;
    })
    const MembershipStatus = "Invited";

    await Promise.all([
        CreateSpeakers({ EventId, SpeakerId, MembershipStatus, UserDetails, Agenda }),
        SendNotificationForSpeaker(EventId, SpeakerId, UserId),
        PushArrayEvents({ Speakers: { SpeakerId, UserDetails: UserDetails, Agenda: Agenda } }, EventId),
        UpdateEvents({ Agenda: updatedAgenda }, EventId)
    ])

    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchSpeakers = async (req, res) => {
    const { EventId } = req.params;
    //@ts-ignore
    const { UserId: SpeakerId } = req.user;
    const [Speaker] = await ReadSpeakers({ SpeakerId, EventId }, undefined, 1, undefined);
    if (Speaker?.MembershipStatus === "Accepted") {
        return res.status(444).json(AlertBoxObject("Already Accepted", "You have already accepted the invitaion."));
    }
    const [Member] = await ReadMembers({ MemberId: SpeakerId, EntityId: EventId }, undefined, 1, undefined);
    const MemberData = MemberInit({ EntityId: EventId, MemberId: SpeakerId, UserDetails: Speaker.UserDetails });
    await Promise.all([
        UpdateSpeakers({ MembershipStatus: "Accepted" }, Speaker.DocId),
        Member ? Promise.resolve() : CreateMembers(MemberData),
        IncrementEvents({ NoOfMembers: 1 }, EventId),

    ])
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const InviteSpeakersThroughEmail = async (req, res) => {
    const { EventId } = req.params;
    const { InvitationData } = req.body;
    const Event = await ReadOneFromEvents(EventId);
    await Promise.all(InvitationData.map(async Data => {
        const { Email, Agenda, FullName, About } = Data;
        const [[Speaker], [User]] = await Promise.all([
            ReadSpeakers({ "UserDetails.Email": Email, EventId }, undefined, 1, undefined),
            ReadUsers({ Email }, undefined, 1, undefined)
        ]);
        if (User) {
            return res.status(444).json(AlertBoxObject("User Already Exists", "User aLready Exists"))
        }
        if (Speaker) {
            return res.status(444).json(AlertBoxObject("Already Invited", "You have already invited this Email"));
        }

        const SpeakerId = new ObjectId().toString();
        const UserDetails = { FullName, About, Email, ProfilePicture: '' }
        const SpeakerData = SpeakerInit({ SpeakerId, EventId, MembershipStatus: "Accepted", Agenda, UserDetails  });
        const { Agenda: AgendaData } = Event;
        const updatedAgenda = AgendaData.map(item => {
            if (item.AgendaId === Agenda.AgendaId) {
                return { ...item, SpeakerData: { SpeakerId, UserDetails } }
            }
            return item;
        })
        await Promise.all([
            PushArrayEvents({ Speakers: { SpeakerId, UserDetails: SpeakerData.UserDetails, Agenda, } }, EventId),
            CreateSpeakers(SpeakerData),
            UpdateEvents({ Agenda: updatedAgenda }, EventId),
            //SendSpeakerInviteEmail(Email, SpeakerId, Event, Agenda, FullName)
        ])
    }))
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteSpeakers = async (req, res) => {
    const { EventId, SpeakerId } = req.params;
    const [Speaker] = await ReadSpeakers({ SpeakerId, EventId }, undefined, 1, undefined);
    await Promise.all([
        RemoveSpeakers(Speaker.DocId),
        PullArrayEvents({ Speakers: { SpeakerId } }, EventId),
        RemoveNotificationForSpeaker(EventId, SpeakerId),
    ])
    return res.json(true);
}

/**
 * 
 * @param {object} Data
 * @param {string} Data.SpeakerId
 * @param {string} Data.EventId
 * @param {"Invited"|"Accepted"} Data.MembershipStatus
 * @param {UserData|{FullName: string,About : string,Email : string}} Data.UserDetails
 * @param {import('./../databaseControllers/speakers-databaseController.js').AgendaData} Data.Agenda
 * @returns 
 */
const SpeakerInit = (Data) => {
    return {
        ...Data
    }
}

export {
    GetOneFromSpeakers, GetSpeakerstoInvite, PostSpeakers, PatchSpeakers, DeleteSpeakers,
    SpeakerInit, InviteSpeakersThroughEmail
}