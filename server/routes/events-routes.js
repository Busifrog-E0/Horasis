import {
    GetOneFromEvents, GetEvents, PostEvents, PatchEvents, DeleteEvents,
    GetUserEvents,
    GetInvitedEvents,
} from '../controllers/events-controller.js';
import asyncHandler from 'express-async-handler';
import {
    AcceptJoinRequest, AcceptMemberInvitation, DeleteMembers, DeleteTempMembers,
    GetJoinRequests, GetMembers, GetMembersToInvite, InviteMembers, PostMembers, RemoveMemberPermissions, UpdateMemberPermissions
} from '../controllers/members-controller.js';
import SwaggerDocs from '../swaggerDocs/events-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostEvents } from '../validations/events-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { GetEventsActivitiesMiddleware, InsertEventTypeMiddleware, PostEventActivitiesMiddleware } from '../middleware/events-middleware.js';
import { ValidatePostActivities } from '../validations/activities-validations.js';
import { MemberPostActivityMiddleware } from '../middleware/members-middleware.js';
import { ValidateAddPermissionForEveryone, ValidatePatchMemberPermission, ValidatePatchRemovePermission } from '../validations/discussions-validations.js';
import { GetFilteredActivities, PostActivities } from '../controllers/activities-controller.js';
import { ValidateInviteMembers } from '../validations/members-validations.js';
const router = e.Router();

router.get('/events', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Events,
    // @ts-ignore
    asyncHandler(GetEvents));

router.get('/events/:EventId', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.get_Events_EventsId,
    // @ts-ignore
    asyncHandler(GetOneFromEvents));

router.post('/events', decodeIDToken, ensureAuthorized("User"), ValidatePostEvents,
    SwaggerDocs.post_Events,
    // @ts-ignore
    asyncHandler(PostEvents));

router.patch('/events/:EventId',
    // @ts-ignore
    asyncHandler(PatchEvents));


/**************************************************************************JOIN******************************************************************* */

router.post('/events/:EntityId/join', decodeIDToken, ensureAuthorized("User"), InsertEventTypeMiddleware,
    SwaggerDocs.post_Events_EntityId_Join,
    //@ts-ignore
    asyncHandler(PostMembers));

router.delete('/events/:EntityId/join/:UserId/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Events_EventId_Join_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.patch('/events/:EntityId/join/:UserId/accept', decodeIDToken, ensureAuthorized("User"), InsertEventTypeMiddleware,
    SwaggerDocs.patch_Events_EventId_Join_Accept,
    //@ts-ignore
    asyncHandler(AcceptJoinRequest));


router.get('/events/:EntityId/members/requested', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Events_EventId_Members_Requested,
    //@ts-ignore
    asyncHandler(GetJoinRequests));



router.delete('/events/:EntityId/join/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), InsertEventTypeMiddleware,
    SwaggerDocs.delete_Event_EventId_Join_Cancel,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

/****************************************************************INVITE************************************************************************************************** */

router.get('/events/:EntityId/members/invite', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Events_EventId_Members_Invited,
    //@ts-ignore
    asyncHandler(GetMembersToInvite));

router.post('/events/:EntityId/invite/:InviteeId', decodeIDToken, ensureAuthorized("User"), ValidateInviteMembers, InsertEventTypeMiddleware,
    SwaggerDocs.post_Events_EntityId_Invite_InviteeId,
    //@ts-ignore
    asyncHandler(InviteMembers));

router.patch('/events/:EntityId/invite/accept', decodeIDToken, ensureAuthorized("User"), InsertEventTypeMiddleware,
    SwaggerDocs.patch_Events_EntityId_Invite_Accept,
    //@ts-ignore
    asyncHandler(AcceptMemberInvitation));

router.delete('/events/:EntityId/invite/:UserId/reject', decodeIDToken, ensureAuthorized("User"), // changes
    SwaggerDocs.delete_Events_EventId_Invite_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/events/:EntityId/invite/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), // changes
    SwaggerDocs.delete_Events_EventId_Invite_Cancel,
    // @ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/events/:EntityId/leave', decodeIDToken, ensureAuthorized("User"), InsertEventTypeMiddleware,
    SwaggerDocs.delete_Events_EventId_Leave,
    // @ts-ignore
    asyncHandler(DeleteMembers));

/*****************************************************MEMBERS************************************************************************************* */
router.get('/events/:EntityId/members', decodeIDToken, ensureAuthorized("User"),
    ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Events_EventId_Members,
    //@ts-ignore
    asyncHandler(GetMembers));

router.patch('/events/:EntityId/member/permissions', decodeIDToken, ensureAuthorized("User"), ValidatePatchMemberPermission,
    SwaggerDocs.patch_Events_EntityId_Member_Permissions,
    //@ts-ignore
    asyncHandler(UpdateMemberPermissions));

router.patch('/events/:EntityId/member/:MemberId/permissions/remove', decodeIDToken, ensureAuthorized("User"), ValidatePatchRemovePermission,
    SwaggerDocs.patch_Events_EntityId_Member_Permissions_Remove,
    //@ts-ignore
    asyncHandler(RemoveMemberPermissions));

router.patch('/events/:EntityId/member/permissions/everyone', decodeIDToken, ensureAuthorized("User"), ValidateAddPermissionForEveryone,
    SwaggerDocs.patch_Events_EntityId_Member_Permissions_Everyone,
    //@ts-ignore
    asyncHandler(PatchEvents));

/*********************************************************************FILTERED EVENTS********************************************************************* */

router.get('/user/:UserId/events', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_User_UserId_Events,
    //@ts-ignore
    asyncHandler(GetUserEvents))

router.get('/user/:UserId/events/invited', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Events_Invited,
    //@ts-ignore
    asyncHandler(GetInvitedEvents));

/************************************************************************ACTIVITIES************************************************************************* */

router.post('/events/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidatePostActivities, PostEventActivitiesMiddleware,
    MemberPostActivityMiddleware, SwaggerDocs.post_Events_EventId_Activities,
    //@ts-ignore
    asyncHandler(PostActivities));

router.get('/events/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    GetEventsActivitiesMiddleware, SwaggerDocs.get_Events_EventId_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.delete('/events/:EventId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteEvents));

export default router;