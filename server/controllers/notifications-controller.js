import e from 'express';

import { ReadOneFromNotifications, ReadNotifications, UpdateNotifications, CreateNotifications, RemoveNotifications, UpdateManyNotifications, CountNotifications, } from './../databaseControllers/notifications-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ConnectionStatus } from './connections-controller.js';
import { ReadMembers } from '../databaseControllers/members-databaseController.js';
import { ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';
import { ReadSpeakers } from '../databaseControllers/speakers-databaseController.js';
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
    const { UserId } = req.user;
    const { RecipientId } = req.params;
    // @ts-ignore
    Filter.RecipientId = RecipientId;
    // @ts-ignore
    const Notifications = await ReadNotifications(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Notifications.map(async Notification => await AddContentAndStatusToNotification(Notification)));
    if (!NextId && UserId === RecipientId) {
        UpdateManyNotifications({ HasSeen: true, RecipientId }, { HasSeen: false });
    }
    return res.json(data);
}

/**
* @param { e.Request } req
* @param { e.Response } res
* @returns { Promise<e.Response<NotificationData>>}
*/
const GetOneFromNotifications = async (req, res) => {
    const { NotificationId } = req.params;
    //@ts-ignore
    const Notification = await ReadOneFromNotifications(NotificationId);
    const data = await AddContentAndStatusToNotification(Notification)
    return res.json(data);
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<number>>}
 */
const GetUnreadNotification = async (req, res) => {
    // @ts-ignore
    const { UserId } = req.user;
    const Count = await CountNotifications({ HasSeen: false, RecipientId: UserId });
    return res.json(Count);
}

/**
 * 
 * @param {NotificationData} Notification 
 * @returns 
 */
const AddContentAndStatusToNotification = async (Notification) => {
    if (Notification.Type === "Like") {
        const [Activity, Likes] = await Promise.all([
            ReadOneFromActivities(Notification.EntityId),
            ReadLikes({ EntityId: Notification.EntityId }, undefined, 2, undefined)
        ])
        const { NoOfLikes } = Activity;
        switch (NoOfLikes) {
            case (1): {
                Notification.Content = `@${Likes[0].UserDetails.FullName}@ liked your Activity!`;
                Notification.UserDetails = Likes[0].UserDetails;
                Notification.ContentLinks = [{ Text: Likes[0].UserDetails.FullName, Link: `/ViewProfile/${Likes[0].UserId}` }]
                break;
            }
            case (2): {
                Notification.Content = `@${Likes[0].UserDetails.FullName}@ and @${Likes[1].UserDetails.FullName}@ liked your Activity!`;
                Notification.UserDetails = Likes[0].UserDetails;
                Notification.ContentLinks = [
                    { Text: Likes[0].UserDetails.FullName, Link: `/ViewProfile/${Likes[0].UserId}` },
                    { Text: Likes[1].UserDetails.FullName, Link: `/ViewProfile/${Likes[1].UserId}` }
                ]
                break;
            }
            case 0: {
                break;
            }
            default: {
                Notification.Content = `@${Likes[0].UserDetails.FullName}@, @${Likes[1].UserDetails.FullName}@ and ${NoOfLikes - 2} others liked your Activity!`;
                Notification.UserDetails = Likes[0].UserDetails;
                Notification.ContentLinks = [
                    { Text: Likes[0].UserDetails.FullName, Link: `/ViewProfile/${Likes[0].UserId}` },
                    { Text: Likes[1].UserDetails.FullName, Link: `/ViewProfile/${Likes[1].UserId}` }
                ]
                break;
            }
        }
    }
    if (Notification.Type === "Connection-Request") {
        const ConnectionRequestStatus = await ConnectionStatus(Notification.RecipientId, Notification.UserDetails.DocId);
        switch (ConnectionRequestStatus.Status) {
            case "Connection Received":
                Notification.Content = `@${Notification.UserDetails.FullName}@ has send you a connection request`;
                break;
            case "Connected":
                Notification.Content = `@${Notification.UserDetails.FullName}@ and you are now connected`;
                break;
            default:
                break;
        }
        Notification.Status = ConnectionRequestStatus.Status;
    }
    if (Notification.Type === "Join-Request") {
        const Member = await ReadMembers({ MemberId: Notification.UserDetails.DocId, EntityId: Notification.EntityId }, undefined, 1, undefined);
        switch (Member[0].MembershipStatus) {
            case "Requested":
                Notification.Content = `@${Notification.UserDetails.FullName}@ has send you a join request to ${Notification.EntityType} : @${Notification.EntityName}@`;
                break;
            case "Accepted":
                Notification.Content = `@${Notification.UserDetails.FullName}@ have joined ${Notification.EntityType} : @${Notification.EntityName}@`;
                break;
            default:
                break;
        }
        Notification.Status = Member[0].MembershipStatus;
    }
    if (Notification.Type === "Invitation") {
        const Member = await ReadMembers({ MemberId: Notification.RecipientId, EntityId: Notification.EntityId }, undefined, 1, undefined);
        switch (Member[0].MembershipStatus) {
            case "Invited":
                Notification.Content = `@${Notification.UserDetails.FullName}@ has send you an invitation to ${Notification.EntityType} : @${Notification.EntityName}@`;
                break;
            case "Accepted":
                Notification.Content = `You have accepted the invitation to ${Notification.EntityType} : @${Notification.EntityName}@`;
                break;
            default:
                break;
        }
        Notification.Status = Member[0].MembershipStatus;
    }
    return Notification;
}

/**
 * 
 * @typedef {Omit<NotificationData, 'HasSeen'|'RecipientId'|'DocId'|'ActionLinks'>} NotificationObject
 * @param {NotificationObject} NotificationObject 
 * @param {string} UserId 
 */
const SendNotificationToUser = async (NotificationObject, UserId) => {
        await CreateNotifications({ ...NotificationObject, RecipientId: UserId, HasSeen: false });
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
    const UserDetails = await ReadOneFromUsers(UserId);
    await Promise.all(Mentions.map(async Mention => {
        const NotificationObject = {
            NotifierId: UserId,
            EntityId: ActivityId,
            EntityType: "Activity",
            Content: `@${UserDetails.FullName}@ mentioned you in an Activity!`,
            Link: `/activities/${ActivityId}`,
            Type: "Mention",
            ContentLinks: [{ Text: UserDetails.FullName, Link: `/ViewProfile/${UserId}` }],
            UserDetails
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

    let promises = [];
    promises.push(MentionsRemoved.map(async MentionRemoved => {
        const Notifications = await ReadNotifications(
            { EntityId: ActivityId, EntityType: "Activity", UserId: MentionRemoved.UserId, Type: "Mention" },
            undefined, 1, undefined);
        await RemoveNotifications(Notifications[0].DocId);
    }))
    if (MentionsAdded) {
        promises.push(SendNotificationstoActivityMentions(MentionsAdded, UserId, ActivityId));
    }
    await Promise.all(promises);
}

/**
 * 
 * @param {{Username : string,UserId : string , FullName : string}[]} Mentions 
 * @param {string} UserId 
 * @param {string} ActivityId 
 */
const SendNotificationstoCommentMentions = async (Mentions, UserId, ActivityId) => {
    const UserDetails = await ReadOneFromUsers(UserId);
    await Promise.all(Mentions.map(async Mention => {
        const NotificationObject = {
            NotifierId: UserId,
            EntityId: ActivityId,
            EntityType: "Activity",
            Content: `@${UserDetails.FullName}@ mentioned you in an Comment!`,
            Link: `/activities/${ActivityId}`,
            Type: "Comment-Mention",
            ContentLinks: [{ Text: UserDetails.FullName, Link: `/ViewProfile/${UserId}` }],
            UserDetails
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
    const [Notification] = await ReadNotifications({ EntityId: ActivityId, Type: "Like" }, undefined, 1, undefined);
    if (Notification) {
        return;
    }
    const [UserDetails, Activity] = await Promise.all([
        ReadOneFromUsers(UserId),
        ReadOneFromActivities(ActivityId),
    ]);
    const NotificationObject = {
        NotifierId: UserId,
        EntityId: ActivityId,
        EntityType: "Activity",
        Content: "",
        Link: `/activities/${ActivityId}`,
        Type: "Like",
        ContentLinks: [],
        UserDetails
    }
    return SendNotificationToUser(NotificationObject, Activity.UserId);
}

/**
 * 
 * @param {string} ActivityId 
 * @returns 
 */
const RemoveNotificationForActivityLikes = async (ActivityId) => {
    const Activity = await ReadOneFromActivities(ActivityId);
    if (Activity.NoOfLikes === 0) {
        const [Notification] = await ReadNotifications({ EntityId: ActivityId, Type: "Like" }, undefined, 1, undefined);
        await RemoveNotifications(Notification.DocId);
    }
    return;
}

/**
 * 
 * @param {string} ActivityId 
 * @param {string} NotifierId
 * @returns 
 */
const SendNotificationToUserOnCommentPost = async (ActivityId, NotifierId) => {
    const [Activity, Notifier] = await Promise.all([
        ReadOneFromActivities(ActivityId),
        ReadOneFromUsers(NotifierId)
    ]);
    const NotificationObject = {
        NotifierId: NotifierId,
        EntityId: ActivityId,
        EntityType: "Activity",
        Content: `@${Notifier.FullName}@ posted a comment on your Activity!`,
        Link: `/activities/${ActivityId}`,
        Type: "Comment",
        ContentLinks: [{ Text: Notifier.FullName, Link: `/ViewProfile/${Notifier.DocId}` }],
        UserDetails: Notifier,
    }
    return SendNotificationToUser(NotificationObject, Activity.UserId);
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
        NotifierId: SenderDetails.DocId,
        EntityId: ConnectionId,
        EntityType: "Connection",
        Content: "",
        Link: `/ViewProfile/${SenderDetails.DocId}`,
        Type: "Connection-Request",
        ContentLinks: [{ Text: SenderDetails.FullName, Link: `/ViewProfile/${SenderDetails.DocId}` }],
        UserDetails: SenderDetails
    }
    return await SendNotificationToUser(NotificationObject, ReceiverDetails.DocId);
}




/**
 * 
 * @param {string} ConnectionId  
 * @returns 
 */
const RemoveNotificationsForConnectionRequest = async (ConnectionId) => {
    const Notifications = await ReadNotifications({ EntityId: ConnectionId, }, undefined, -1, undefined);
    return Promise.all(Notifications.map(Notification => RemoveNotifications(Notification.DocId)));
}

/**
 * 
 * @param {string} ConnectionId 
 * @param {string} SenderId
 * @param {string} ReceiverId
 * @returns 
 */
const SendNotificationsForConnectionAccept = async (ConnectionId, SenderId, ReceiverId) => {
    const [Receiver] = await Promise.all([ReadOneFromUsers(ReceiverId)]);
    const NotificationObject = {
        NotifierId: ReceiverId,
        EntityId: ConnectionId,
        EntityType: "Connection",
        Content: `@${Receiver.FullName}@ have accepted your connection request`,
        Link: `/ViewProfile/${Receiver.DocId}`,
        Type: "Connection-Accept",
        ContentLinks: [{ Text: Receiver.FullName, Link: `/ViewProfile/${Receiver.DocId}` }],
        UserDetails: Receiver
    }
    return await SendNotificationToUser(NotificationObject, SenderId);
}

/************************************************************************FOLLOW********************************************************************************************************* */

const SendNotificationsForFollow = async (FollowerId, FolloweeId) => {
    const Follower = await ReadOneFromUsers(FollowerId);
    const NotificationObject = {
        NotifierId: FollowerId,
        EntityId: FollowerId,
        EntityType: "User",
        Content: `@${Follower.FullName}@ is now following you!`,
        Link: `/ViewProfile/${FollowerId}`,
        Type: "Follow",
        ContentLinks: [{ Text: Follower.FullName, Link: `/ViewProfile/${FollowerId}` }],
        UserDetails: Follower
    }
    return await SendNotificationToUser(NotificationObject, FolloweeId);
}


/**
 * 
 * @param {string} FollowerId 
 * @returns 
 */
const RemoveNotificationsForFollow = async (FollowerId, FolloweeId) => {
    const [Notification] = (await ReadNotifications({ EntityId: FollowerId, RecipientId: FolloweeId }, undefined, 1, undefined));
    return RemoveNotifications(Notification.DocId);
}

/***************************************************************************MEMBER-NOTIFICATIONS************************************************************************************************* */

/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @returns 
 */
const SendNotificationForMemberJoin = async (Type, EntityId, UserId) => {
    const UserDetails = await ReadOneFromUsers(UserId);
    let EntityName = '';
    let Link = '';
    let SendToUserId = '';
    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
        SendToUserId = Discussion.OrganiserId;
    }
    if (Type === "Event") {
        const Event = await ReadOneFromEvents(EntityId);
        EntityName = Event.EventName;
        Link = `/events/${EntityId}`
        SendToUserId = Event.OrganiserId;
    }
    const NotificationObject = {
        NotifierId: UserId,
        EntityId: EntityId,
        EntityType: Type,
        Content: `@${UserDetails.FullName}@ joined your ${Type} : ${EntityName}!`,
        Link: Link,
        Type: "Join",
        ContentLinks: [{ Text: UserDetails.FullName, Link: `/ViewProfile/${UserId}` }],
        UserDetails
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
    const UserDetails = await ReadOneFromUsers(UserId);
    let EntityName = '';
    let Link = '';
    let SendToUserId = '';
    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
        SendToUserId = Discussion.OrganiserId;
    }
    if (Type === "Event") {
        const Event = await ReadOneFromEvents(EntityId);
        EntityName = Event.EventName;
        Link = `/events/${EntityId}`
        SendToUserId = Event.OrganiserId;
    }
    const NotificationObject = {
        NotifierId: UserId,
        EntityId: EntityId,
        EntityType: Type,
        Content: ``,
        Link: Link,
        Type: "Join-Request",
        ContentLinks: [
            { Text: UserDetails.FullName, Link: `/ViewProfile/${UserId}` },
            { Text: EntityName, Link: Link }
        ],
        UserDetails,
        EntityName
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
const SendNotificationForMemberRequestStatus = async (Type, EntityId, UserId, Status, NotifierId) => {
    const Notifier = await ReadOneFromUsers(NotifierId)
    let EntityName = '';
    let Link = '';

    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
    }
    if (Type === "Event") {
        const Event = await ReadOneFromEvents(EntityId);
        EntityName = Event.EventName;
        Link = `/events/${EntityId}`
    }
    const NotificationObject = {
        NotifierId: NotifierId,
        EntityId: EntityId,
        EntityType: Type,
        Content: `Your request has been ${Status.toLowerCase()} for your ${Type} @${EntityName}@ !`,
        Link: Link,
        Type: "Join-Status",
        ContentLinks: [{ Text: EntityName, Link: Link }],
        UserDetails: Notifier
    }
    return await SendNotificationToUser(NotificationObject, UserId);
}


/**
 * 
 * @param {"Discussion" | "Event"} Type 
 * @param {string} EntityId 
 * @param {string} UserId 
 * @param {string} SenderId
 * @returns 
 */
const SendNotificationForMemberInvitation = async (Type, EntityId, UserId, SenderId) => {

    const UserDetails = await ReadOneFromUsers(SenderId);
    let EntityName = '';
    let Link = '';

    if (Type === "Discussion") {
        const Discussion = await ReadOneFromDiscussions(EntityId);
        EntityName = Discussion.DiscussionName;
        Link = `/discussions/${EntityId}`
    }
    if (Type === "Event") {
        const Event = await ReadOneFromEvents(EntityId);
        EntityName = Event.EventName;
        Link = `/events/${EntityId}`
    }
    const NotificationObject = {
        NotifierId: SenderId,
        EntityId: EntityId,
        EntityType: Type,
        Content: ``,
        Link: Link,
        Type: "Invitation",
        ContentLinks: [
            { Text: EntityName, Link: Link },
            { Text: UserDetails.FullName, Link: `/ViewProfile/${SenderId}` }],
        UserDetails,
        EntityName,

    }
    return await SendNotificationToUser(NotificationObject, UserId);
}

const RemoveNotificationForMember = async (EntityId, UserId) => {
    const Notifications = await ReadNotifications({ EntityId, RecipientId: UserId, Type: { $in: ["Invitation", "Join-Status"] } }, undefined, -1, undefined);
    const NotificationsForAdmin = await ReadNotifications({ EntityId, NotifierId: UserId, Type: { $in: ["Join", "Join-Request"] } }, undefined, -1, undefined);
    return Promise.all([...Notifications, ...NotificationsForAdmin].map(Notification => RemoveNotifications(Notification.DocId)));
}

/**************************************************SPEAKERS*************************************************************************************************************** */

const SendNotificationForSpeaker = async (EntityId, UserId, SendUserId) => {
    const UserDetails = await ReadOneFromUsers(SendUserId);
    const Event = await ReadOneFromEvents(EntityId);
    const EntityName = Event.EventName;
    const Link = `/events/${EntityId}`;
    const NotificationObject = {
        NotifierId: SendUserId,
        EntityId: EntityId,
        EntityType: "Event",
        Content: `You have been invited as a speaker for Event @${EntityName}@ by @${UserDetails.FullName}@ !`,
        Link: Link,
        Type: "Invitation-Speaker",
        ContentLinks: [
            { Text: EntityName, Link: Link },
            { Text: UserDetails.FullName, Link: `/ViewProfile/${SendUserId}` }],
        UserDetails,
        EntityName,

    }
    return await SendNotificationToUser(NotificationObject, UserId);
}

const RemoveNotificationForSpeaker = async (EventId, UserId) => {
    const [Notifications] = await ReadNotifications({ EntityId: EventId, RecipientId: UserId, Type: "Invitation-Speaker" }, undefined, -1, undefined);
    return RemoveNotifications(Notifications.DocId);
}


const RemoveNotificationForEntity = async (EntityId) => {
    const Notifications = await ReadNotifications({ EntityId }, undefined, -1, undefined);
    return Promise.all(Notifications.map(Notification => RemoveNotifications(Notification.DocId)));
}


export {
    GetNotifications, DeleteNotifications, GetUnreadNotification,
    SendNotificationstoActivityMentions, SendNotificationstoCommentMentions, SendNotificationsforActivityLikes,
    SendNotificationsForFollow, SendNotificationForMemberRequest, SendNotificationForMemberRequestStatus, SendNotificationForMemberInvitation,
    SendNotificationToUser, SendNotificationForMemberJoin, SendNotificationsForConnectionAccept, SendNotificationsForConnectionRequest,
    RemoveNotificationsAfterActivityMentionPatch, RemoveNotificationsForConnectionRequest, GetOneFromNotifications,
    RemoveNotificationsForFollow, RemoveNotificationForMember, SendNotificationToUserOnCommentPost, RemoveNotificationForEntity,
    SendNotificationForSpeaker, RemoveNotificationForSpeaker, RemoveNotificationForActivityLikes

}