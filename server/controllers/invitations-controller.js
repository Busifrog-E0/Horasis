import e from 'express';

import { ReadOneFromInvitations, ReadInvitations, UpdateInvitations, CreateInvitations, RemoveInvitations, } from './../databaseControllers/invitations-databaseController.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { CreateSpeakers, ReadSpeakers, } from '../databaseControllers/speakers-databaseController.js';
import { SpeakerInit } from './speakers-controller.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { MemberInit } from './members-controller.js';
import { SendNotificationForMemberInvitation, SendNotificationForSpeaker } from './notifications-controller.js';
import { PushArrayEvents, ReadOneFromEvents, UpdateEvents } from '../databaseControllers/events-databaseController.js';

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {import('./../databaseControllers/invitations-databaseController.js').InvitationData} InvitationData 
 */

/**
 * @typedef {import('../databaseControllers/events-databaseController.js').AgendaData} AgendaData
 */
/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<InvitationData>>}
 */
const GetOneFromInvitations = async (req, res) => {
    const { InvitationId } = req.params;
    const data = await ReadOneFromInvitations(InvitationId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<InvitationData>>>}
 */
const GetInvitations = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadInvitations(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostInvitations = async (req, res) => {
    await CreateInvitations(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchInvitations = async (req, res) => {
    const { InvitationId } = req.params;
    await UpdateInvitations(req.body, InvitationId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteInvitations = async (req, res) => {
    const { InvitationId } = req.params;
    await RemoveInvitations(InvitationId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const InviteUserToCreateAccount = async (req, res) => {
    const { ActionType, EntityId, InvitationData } = req.body;
    //@ts-ignore
    const { UserId } = req.user;
    await Promise.all(InvitationData.map(async Data => {
        const [checkUser] = await ReadUsers({ Email: Data.EmailId }, undefined, 1, undefined);
        if (checkUser) {
            await CreateEntitiesBasedOnActionType(ActionType, EntityId, checkUser, checkUser.DocId, UserId, Data);
            return;
        }
        const InvitedUser = await ReadInvitations({ Email: Data.EmailId }, undefined, 1, undefined);
        const OnCreateObject = { EntityId, ActionType, SentUserId: UserId, Data };
        if (InvitedUser.length > 0) {
            if (InvitedUser[0].OnCreate.includes(ActionType)) {
                //Send Invite Email
                return;
            }
            await UpdateInvitations({ OnCreate: InvitedUser[0].OnCreate.push(OnCreateObject) }, InvitedUser[0].DocId);
            //Send Invite Email
            return;
        }
        await CreateInvitations({ Email: Data.EmailId, OnCreate: [OnCreateObject] });
        //Send Invite Emails
    }))
    return res.json(true);
}

const AddUserDetailsAfterInvited = async (UserData, UserId) => {
    delete UserData.Password;
    const { Email } = UserData;
    const checkInvitedUser = await ReadInvitations({ Email }, undefined, 1, undefined);
    if (checkInvitedUser.length === 0) {
        return;
    }
    const [InvitedUser] = checkInvitedUser;
    await Promise.all(InvitedUser.OnCreate.map(async OnCreateObject =>
        await CreateEntitiesBasedOnActionType(OnCreateObject.ActionType, OnCreateObject.EntityId, UserData, UserId, OnCreateObject.SentUserId, OnCreateObject.Data)))
    RemoveInvitations(InvitedUser.DocId);
}

/**
 * 
 * @param {"Event-Invite-Speaker"|"Discussion-Invite-Member"|"Event-Invite-Member"|"Podcast-Invite-Member"} ActionType 
 * @param {string} EntityId 
 * @param {UserData} UserData 
 * @param {string} UserId
 * @param {string} SendUserId
 * @param {object} Data
 * @param {AgendaData} Data.Agenda
 */
const CreateEntitiesBasedOnActionType = async (ActionType, EntityId, UserData, UserId, SendUserId, Data) => {
    switch (ActionType) {
        case "Event-Invite-Speaker": {
            const MembershipStatus = "Invited";
            const [Speaker] = await ReadSpeakers({ SpeakerId: UserId, EventId: EntityId }, undefined, 1, undefined);
            if (Speaker) {
                break;
            }
            await Promise.all([
                CreateSpeakers(SpeakerInit({ EventId: EntityId, SpeakerId: UserId, MembershipStatus, UserDetails: UserData, Agenda: Data.Agenda })),
                SendNotificationForSpeaker(EntityId, UserId, SendUserId),

            ])
            break;
        }
        case "Discussion-Invite-Member":
        case "Event-Invite-Member":
        case "Podcast-Invite-Member":
            {
                const [Member] = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
                if (Member) {
                    break;
                }
                await CreateMembers(MemberInit({ EntityId, MemberId: UserId, UserDetails: UserData, Type: ActionType.split("-")[0] }), "Invited");
                //@ts-ignore
                await SendNotificationForMemberInvitation(ActionType.split("-")[0], EntityId, UserId, SendUserId)
                break;
            }
        default:
            break;
    }
    return;
}





export {
    GetOneFromInvitations, GetInvitations, PostInvitations, PatchInvitations, DeleteInvitations,
    InviteUserToCreateAccount, AddUserDetailsAfterInvited,
}
