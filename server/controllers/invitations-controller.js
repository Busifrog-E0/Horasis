import e from 'express';

import { ReadOneFromInvitations, ReadInvitations, UpdateInvitations, CreateInvitations, RemoveInvitations, } from './../databaseControllers/invitations-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { CreateSpeakers, ReadSpeakers, UpdateSpeakers } from '../databaseControllers/speakers-databaseController.js';
import { SpeakerInit } from './speakers-controller.js';
import { CreateMembers, ReadMembers } from '../databaseControllers/members-databaseController.js';
import { MemberInit } from './members-controller.js';
import { CheckIfUserWithMailExists } from './users-controller.js';
import { CheckIfMailAvailableToInviteInEvent } from './events-controller.js';
import moment from 'moment';
import { SendNotificationForMemberInvitation, SendNotificationForSpeaker } from './notifications-controller.js';

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {import('./../databaseControllers/invitations-databaseController.js').InvitationData} InvitationData 
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
    const { EmailIds, ActionType, EntityId } = req.body;
    //@ts-ignore
    const { UserId } = req.user;
    await Promise.all(EmailIds.map(async Email => {
        const [checkUser] = await ReadUsers({ Email }, undefined, 1, undefined);
        if (checkUser) {
            await CreateEntitiesBasedOnActionType(ActionType, EntityId, checkUser, checkUser.DocId, UserId);
            return;
        }
        const InvitedUser = await ReadInvitations({ Email }, undefined, 1, undefined);
        const OnCreateObject = { EntityId, ActionType, SentUserId: UserId };
        if (InvitedUser.length > 0) {
            if (InvitedUser[0].OnCreate.includes(ActionType)) {
                //Send Invite Email
                return;
            }
            await UpdateInvitations({ OnCreate: InvitedUser[0].OnCreate.push(OnCreateObject) }, InvitedUser[0].DocId);
            //Send Invite Email
            return;
        }
        await CreateInvitations({ Email, OnCreate: [OnCreateObject] });
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
        await CreateEntitiesBasedOnActionType(OnCreateObject.ActionType, OnCreateObject.EntityId, UserData, UserId, OnCreateObject.SentUserId)))
    RemoveInvitations(InvitedUser.DocId);
}

/**
 * 
 * @param {"Event-Invite-Speaker"|"Discussion-Invite-Member"|"Event-Invite-Member"} ActionType 
 * @param {string} EntityId 
 * @param {UserData} UserData 
 * @param {string} UserId
 * @param {string} SendUserId
 */
const CreateEntitiesBasedOnActionType = async (ActionType, EntityId, UserData, UserId, SendUserId) => {
    switch (ActionType) {
        case "Event-Invite-Speaker":
            const MembershipStatus = "Invited";
            const [Speaker] = await ReadSpeakers({ SpeakerId: UserId, EventId: EntityId }, undefined, 1, undefined);
            if (Speaker) {
                break;
            }
            await CreateSpeakers(SpeakerInit({ EventId: EntityId, SpeakerId: UserId, MembershipStatus, UserDetails: UserData }));
            await SendNotificationForSpeaker(EntityId, UserId, SendUserId)
            break;
        case "Discussion-Invite-Member":
        case "Event-Invite-Member":
            const [Member] = await ReadMembers({ MemberId: UserId, EntityId }, undefined, 1, undefined);
            if (Member) {
                break;
            }
            await CreateMembers(MemberInit({ EntityId, MemberId: UserId, UserDetails: UserData }), "Invited");
            //@ts-ignore
            await SendNotificationForMemberInvitation(ActionType.split("-")[0], EntityId, UserId, SendUserId)
            break;
        default:
            break;
    }
    return;
}





export {
    GetOneFromInvitations, GetInvitations, PostInvitations, PatchInvitations, DeleteInvitations,
    InviteUserToCreateAccount, AddUserDetailsAfterInvited, 
}