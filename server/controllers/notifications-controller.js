import e from 'express';

import { ReadOneFromNotifications, ReadNotifications, UpdateNotifications, CreateNotifications, RemoveNotifications, } from './../databaseControllers/notifications-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { Type } from '@aws-sdk/client-s3';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/notifications-databaseController.js').NotificationData} NotificationData 
 */

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {import('../databaseControllers/activities-databaseController.js').MentionsData} MentionsData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<NotificationData>>>}
 */
const GetNotifications = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.UserId = req.user.UserId;
    // @ts-ignore
    const data = await ReadNotifications(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}


/**
 * 
 * @typedef {Omit<NotificationData, 'HasSeen'|'UserId'|'DocId'>} NotificationObject
 * @param {NotificationObject} NotificationObject 
 * @param {string} UserId 
 */
const SendNotificationToUser = async (NotificationObject, UserId) => {
    await CreateNotifications({ ...NotificationObject, UserId, HasSeen: false });
}

/**
 * 
 * @param {{Content : string , Link : string, ContentLinks : {Text : string, Link : string}[]}} NotificationObject 
 * @param {string} NotificationId 
 */
const PatchNotificationToUser = async (NotificationObject, NotificationId) => {
    await UpdateNotifications({ ...NotificationObject, HasSeen: false }, NotificationId);
}

/*******************************************************************ACTIVITY********************************************************************************************* */

/**
 * 
 * @param {{Username : string,UserId : string , FullName : string}[]} Mentions 
 */
const SendNotificationstoActivityMentions = async (Mentions, UserId, ActivityId) => {
    const User = await ReadOneFromUsers(UserId);
    await Promise.all(Mentions.map(async Mention => {
        const NotificationObject = {
            EntityId: ActivityId,
            EntityType: "Activity",
            Content: `@${User.FullName} mentioned you in an Activity!`,
            Link: `/activities/${ActivityId}`,
            Type: "Mention",
            ContentLinks: [{ Text: User.FullName, Link: `/users/${UserId}` }]
        }
        await SendNotificationToUser(NotificationObject, Mention.UserId);
    }))
}
/**
 * 
 * @param {MentionsData[]} MentionsBeforePatch 
 * @param {MentionsData[]} MentionsAfterPatch 
 * @param {string} UserId
 * @param {string} ActivityId 
 */
const RemoveNotificationsAfterActivityMentionPatch = async (MentionsBeforePatch, MentionsAfterPatch, UserId, ActivityId) => {

    const MentionsRemoved = MentionsBeforePatch.filter(MentionBeforePatch =>
        !MentionsAfterPatch.some(MentionAfterPatch => MentionBeforePatch.UserId === MentionAfterPatch.UserId));
    const MentionsAdded = MentionsAfterPatch.filter(MentionAfterPatch =>
        !MentionsBeforePatch.some(MentionBeforePatch => MentionBeforePatch.UserId === MentionAfterPatch.UserId));

    await Promise.all(MentionsRemoved.map(async MentionRemoved => {
        const Notifications = await ReadNotifications(
            { EntityId: ActivityId, EntityType: "Activity", UserId: MentionRemoved.UserId, Type: "Mention" },
            undefined, 1, undefined);
        await RemoveNotifications(Notifications[0].DocId);
    }))
    if (MentionsAdded) {
        await SendNotificationstoActivityMentions(MentionsAdded, UserId, ActivityId);
    }
}

/**
 * 
 * @param {{Username : string,UserId : string , FullName : string}[]} Mentions 
 * @param {string} UserId 
 * @param {string} ActivityId 
 */
const SendNotificationstoCommentMentions = async (Mentions, UserId, ActivityId) => {
    const User = await ReadOneFromUsers(UserId);
    await Promise.all(Mentions.map(async Mention => {
        const NotificationObject = {
            EntityId: ActivityId,
            EntityType: "Activity",
            Content: `${User.FullName} mentioned you in an Comment!`,
            Link: `/activities/${ActivityId}`,
            Type: "Comment-Mention",
            ContentLinks: [{ Text: User.FullName, Link: `/users/${UserId}` }]
        };
        await SendNotificationToUser(NotificationObject, Mention.UserId);
    }))
}

/**
 * 
 * @param {string} UserId 
 * @param {string} ActivityId 
 * @returns 
 */
const SendNotificationsforActivityLikes = async (UserId, ActivityId) => {
    const [User, Activity] = await Promise.all([
        ReadOneFromUsers(UserId),
        ReadOneFromActivities(ActivityId),
    ]);
    let Content = ""
    if (Activity.NoOfLikes === 1) {
        const NotificationObject = {
            EntityId: ActivityId,
            EntityType: "Activity",
            UserId: Activity.UserId, Content: `${User.FullName} liked your Activity!`,
            Link: `/activities/${ActivityId}`,
            Type: "Like",
            ContentLinks: [{ Text: User.FullName, Link: `/users/${UserId}` }]
        }
        return SendNotificationToUser(NotificationObject, Activity.UserId);
    }
    const Likes = await ReadLikes({ EntityId: ActivityId }, undefined, 2, undefined);
    if (Activity.NoOfLikes === 2) {
        Content = `${Likes[0].UserDetails.FullName} and ${Likes[1].UserDetails.FullName} liked your Activity!`;
    }
    if (Activity.NoOfLikes > 2) {
        Content = `${Likes[0].UserDetails.FullName} and ${Likes[1].UserDetails.FullName} and ${Activity.NoOfLikes - 2} others liked your Activity!`;
    }
    const Notification = await ReadNotifications({ UserId: Activity.UserId, EntityId: ActivityId, Type: "Like" }, undefined, 1, undefined);
    return await UpdateNotifications({
        Content, HasSeen: false,
        ContentLinks: [
            { Text: Likes[0].UserDetails.FullName, Link: `/users/${Likes[0].UserId}` },
            { Text: Likes[1].UserDetails.FullName, Link: `/users/${Likes[1].UserId}` }]
    }, Notification[0].DocId);

}

/***********************************************************************CONNECTIONS****************************************************************************************** */
/**
 * 
 * @param {string} ConnectionId 
 * @param {UserData} SenderDetails
 * @param {UserData} ReceiverDetails
 * @returns 
 */
const SendNotificationsForConnectionRequest = async (ConnectionId, SenderDetails, ReceiverDetails) => {
    const NotificationObject = {
        EntityId: ConnectionId,
        EntityType: "Connection",
        Content: `You have a new Connection request from @${SenderDetails.FullName} !`,
        Link: `/users/${SenderDetails.DocId}`,
        Type: "Connection-Request",
        ContentLinks: [{ Text: SenderDetails.FullName, Link: `/users/${SenderDetails.DocId}` }]
    }
    return await SendNotificationToUser(NotificationObject, ReceiverDetails.DocId);
}




/**
 * 
 * @param {string} ConnectionId 
 * @param {string} ReceiverId 
 * @returns 
 */
const RemoveNotificationsForConnectionRequest = async (ConnectionId, ReceiverId) => {
    const Notification = (await ReadNotifications({ UserId: ReceiverId, EntityId: ConnectionId, Type: "Connection-Request" }, undefined, 1, undefined))[0];
    return await RemoveNotifications(Notification.DocId);
}

/**
 * 
 * @param {string} ConnectionId 
 * @param {string} SenderId
 * @param {string} ReceiverId
 * @returns 
 */
const SendNotificationsForConnectionAccept = async (ConnectionId, SenderId, ReceiverId) => {
    const [Receiver, Sender] = await Promise.all([ReadOneFromUsers(ReceiverId), ReadOneFromUsers(SenderId)]);
    const NotificationObject = {
        EntityId: ConnectionId,
        EntityType: "Connection",
        Content: `@${Receiver.FullName} have accepted your connection request`,
        Link: `/users/${Receiver.DocId}`,
        Type: "Connection-Request",
        ContentLinks: [{ Text: Receiver.FullName, Link: `/users/${Receiver.DocId}` }]
    }
    const RequestNotification = await ReadNotifications({ UserId: SenderId, EntityId: ConnectionId, Type: "Connection-Request" }, undefined, 1, undefined)[0];
    await PatchNotificationToUser({
        Content: `You are now connected with @${Sender.FullName}`,
        Link: `/users/${Sender.DocId}`,
        ContentLinks: [{ Text: Sender.FullName, Link: `/users/${Sender.DocId}` }]
    }, RequestNotification.DocId);
    return await SendNotificationToUser(NotificationObject, SenderId);
}

/************************************************************************FOLLOW********************************************************************************************************* */

const SendNotificationsForFollow = async (FollowerId,UserId) => {
    const Follower = await ReadOneFromUsers(FollowerId);
    const NotificationObject = {
        EntityId: FollowerId,
        EntityType: "User",
        Content: `@${Follower.FullName} is now following you!`,
        Link: `/users/${UserId}`,
        Type: "Follow",
        ContentLinks: [{ Text: Follower.FullName, Link: `/users/${UserId}` }]
    }
    return await SendNotificationToUser(NotificationObject, UserId);
}


/***************************************************************************DISCUSSIONS************************************************************************************************* */

/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @returns 
 */
const SendNotificationForMemberJoin = async (Type, EntityId, UserId) => { 
    const User = await ReadOneFromUsers(UserId);
    let EntityName = '';
    let Link = '';
    let SendToUserId='';
    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
        SendToUserId = Discussion.OrganiserId;
    }
    if (Type === "Event") { 
        EntityName = ''
        Link = `/events/${EntityId}`
        SendToUserId = ''
    }
    const NotificationObject = {
        EntityId: EntityId,
        EntityType: Type,
        Content: `@${User.FullName} joined your ${Type}  ${EntityName}!`,
        Link: Link,
        Type: "Join",
        ContentLinks: [{ Text: User.FullName, Link: `/users/${UserId}` }]
    }
    return await SendNotificationToUser(NotificationObject, SendToUserId);
}

/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @returns 
 */
const SendNotificationForMemberRequest = async (Type, EntityId, UserId) => { 
    const User = await ReadOneFromUsers(UserId);
    let EntityName = '';
    let Link = '';
    let SendToUserId='';
    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
        SendToUserId = Discussion.OrganiserId;
    }
    if (Type === "Event") { 
        EntityName = ''
        Link = `/events/${EntityId}`
        SendToUserId = ''
    }
    const NotificationObject = {
        EntityId: EntityId,
        EntityType: Type,
        Content: `@${User.FullName} has requested to join your ${Type} @${EntityName}!`,
        Link: Link,
        Type: "Join-Request",
        ContentLinks: [
            { Text: User.FullName, Link: `/users/${UserId}` },
            {Text : EntityName, Link : Link}
        ]
    }
    return await SendNotificationToUser(NotificationObject, SendToUserId);
}


/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @param {"Accepted" | "Rejected"} Status 
 * @returns 
 */
const SendNotificationForMemberRequestStatus = async (Type, EntityId, UserId, Status) => {

    let EntityName = '';
    let Link = '';

    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
    }
    if (Type === "Event") {
        EntityName = ''
        Link = `/events/${EntityId}`
    }
    const NotificationObject = {
        EntityId: EntityId,
        EntityType: Type,
        Content: `Your request has been ${Status.toLowerCase()} for your ${Type} @${EntityName}!`,
        Link: Link,
        Type: "Join-Status",
        ContentLinks: [{ Text: EntityName, Link: Link }]
    }
    return await SendNotificationToUser(NotificationObject, UserId);
}


/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @returns 
 */
const SendNotificationForMemberInvitation = async (Type, EntityId, UserId) => {

    let EntityName = '';
    let Link = '';

    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
    }
    if (Type === "Event") {
        EntityName = ''
        Link = `/events/${EntityId}`
    }
    const NotificationObject = {
        EntityId: EntityId,
        EntityType: Type,
        Content: `You have been invited to a ${Type} @${EntityName}!`,
        Link: Link,
        Type: "Invitation",
        ContentLinks: [{ Text: EntityName, Link: Link }]
    }
    return await SendNotificationToUser(NotificationObject, UserId);
}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteNotifications = async (req, res) => {
    const { NotificationId } = req.params;
    await RemoveNotifications(NotificationId);
    return res.json(true);
}


export {
    GetNotifications, DeleteNotifications,
    SendNotificationstoActivityMentions, SendNotificationstoCommentMentions, SendNotificationsforActivityLikes,
    SendNotificationsForFollow, SendNotificationForMemberRequest, SendNotificationForMemberRequestStatus, SendNotificationForMemberInvitation,
    SendNotificationToUser, SendNotificationForMemberJoin, SendNotificationsForConnectionAccept, SendNotificationsForConnectionRequest,
    RemoveNotificationsAfterActivityMentionPatch,RemoveNotificationsForConnectionRequest
}