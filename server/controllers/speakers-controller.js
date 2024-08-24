import e from 'express';

import { ReadOneFromSpeakers, ReadSpeakers, UpdateSpeakers, CreateSpeakers, RemoveSpeakers, } from './../databaseControllers/speakers-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { MemberInit } from './members-controller.js';
import { CreateMembers } from '../databaseControllers/members-databaseController.js';
import { IncrementEvents, PullArrayEvents } from '../databaseControllers/events-databaseController.js';
import { RemoveNotificationForSpeaker, SendNotificationForSpeaker } from './notifications-controller.js';
import { RemoveNotifications } from '../databaseControllers/notifications-databaseController.js';
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
        Filter[$or] = [
            { "UserDetails.FullName": { $regex: Keyword, $options: 'i' } },
            { "UserDetails.Username": { $regex: Keyword, $options: 'i' } },
        ]
    }
    const AggregateArray = [
        {
            $lookup: {
                from: "Speakers",
                
            }
        }
    ]
    // @ts-ignore
    const data = await ReadSpeakers(Filter, NextId, Limit, OrderBy);
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
    const MembershipStatus = "Invited";
    const UserDetails = await ReadOneFromUsers(SpeakerId);
    await Promise.all([
        await CreateSpeakers({ EventId, SpeakerId, MembershipStatus, UserDetails }),
        SendNotificationForSpeaker(EventId, SpeakerId, UserId)
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

    const Member = MemberInit({ EntityId: EventId, MemberId: SpeakerId, UserDetails: Speaker.UserDetails });
    await Promise.all([
        UpdateSpeakers({ MembershipStatus: "Accepted" }, Speaker.DocId),
        CreateMembers(Member),
        IncrementEvents({ NoOfMembers: 1 }, EventId)
    ])
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
 * @param {UserData} Data.UserDetails
 * @returns 
 */
const SpeakerInit = (Data) => {
    return {
        Data
    }
}

export {
    GetOneFromSpeakers, GetSpeakerstoInvite, PostSpeakers, PatchSpeakers, DeleteSpeakers,
    SpeakerInit
}