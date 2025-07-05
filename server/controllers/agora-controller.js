import agora from 'agora-token'
import e from 'express';
import { ReadOneFromSpeakers, ReadSpeakers } from '../databaseControllers/speakers-databaseController.js';
import { ReadMembers } from '../databaseControllers/members-databaseController.js';
import { AlertBoxObject } from './common.js';
import Env from '../Env.js';
import { ReadParticipants } from '../databaseControllers/participants-databaseController.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { TokenData } from './auth-controller.js';
import { ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';
import { ObjectId } from 'mongodb';
const { RtcTokenBuilder, RtcRole, RtmTokenBuilder } = agora;

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const generateRTCToken = async (req, res) => {
    const { EventId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    try {
        return res.json(await generateAgoraToken(EventId, UserId))
    } catch (error) {
        return res.status(444).json(AlertBoxObject("Cannot Generate Token", "You are not a member of this event"))
    }
}

const generateTokenForInvitedUser = async (req, res) => {
    const { EventId } = req.params;
    const { Email } = req.body;
    try {
        return res.json(await generateAgoraToken(EventId, Email));
    } catch (error) {
        return res.status(444).json(AlertBoxObject("Cannot Generate Token", "You are not a member of this event"))
    }
}

/**
 * 
 * @param {string} EventId 
 * @param {string} UserId 
 * @returns 
 */
const generateAgoraToken = async (EventId, UserId) => {
    const [[Speaker], [Member], Event] = await Promise.all([
        ReadSpeakers({ SpeakerId: UserId, EventId, MembershipStatus: "Accepted" }, undefined, 1, undefined),
        ReadMembers({ MemberId: UserId, EntityId: EventId, MembershipStatus: "Accepted" }, undefined, 1, undefined),
        ReadOneFromEvents(EventId)
    ]);
    let Role = Speaker ? "Speaker" : (Member ? "Member" : undefined);
    if (Event.OrganiserId === UserId) {
        Role = "Speaker"
    }
    if (!Role) {
        throw new Error("No Access");
    }
    const RtcToken = RtcTokenBuilder.buildTokenWithUid(Env.AGORA_APP_ID, Env.AGORA_APP_CERTIFICATE, EventId, UserId, RtcRole.PUBLISHER, 6000, 6000);
    const RtmToken = RtmTokenBuilder.buildToken(Env.AGORA_APP_ID, Env.AGORA_APP_CERTIFICATE, UserId, 6000);
    return { RtcToken, RtmToken, Role };
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetCallUserData = async (req, res) => {
    const { UserId, EventId } = req.params;
    const [checkUser] = await ReadUsers({ "_id": new ObjectId(UserId) }, undefined, 1, undefined);
    if (!checkUser) {
        const [Speaker] = await ReadSpeakers({ SpeakerId: UserId, EventId }, undefined, 1, undefined);
        return res.json({ ...Speaker.UserDetails, DocId: Speaker.SpeakerId })
    }
    return res.json(checkUser)
}

const GenerateUserTokenForInvited = async (req, res) => {
    const { SpeakerId } = req.params;
    const [Speaker] = await ReadSpeakers({ SpeakerId }, undefined, 1, undefined);
    const Event = await ReadOneFromEvents(Speaker.EventId);
    if (!Speaker) {
        return res.status(444).json(AlertBoxObject("No Access", "You have no access"))
    }
    const Token = await TokenData({
        Role: ["Guest"],
        UserId: Speaker.SpeakerId
    })
    return res.json({ EventId: Speaker.EventId, TokenData: Token, Event })
}

export {
    generateRTCToken,
    generateTokenForInvitedUser,
    GetCallUserData,
    GenerateUserTokenForInvited
}