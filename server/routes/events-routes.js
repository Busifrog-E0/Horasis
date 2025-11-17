import {
    GetOneFromEvents, GetEvents, PostEvents, PatchEvents, DeleteEvents,
    GetUserEvents,
    GetInvitedEvents,
    GetPublicEvents,
} from '../controllers/events-controller.js';
import asyncHandler from 'express-async-handler';
import {
    AcceptJoinRequest, AcceptMemberInvitation, DeleteMembers, DeleteTempMembers,
    GetJoinRequests, GetMembers, GetMembersToInvite, InviteMembers, PostMembers, RemoveMemberPermissions, UpdateMemberPermissions
} from '../controllers/members-controller.js';
import SwaggerDocs from '../swaggerDocs/events-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateGetEvents, ValidatePatchEventCoverPhoto, ValidatePostEvents, ValidatePostSpeakerMailInvite, ValidatePostSpeakers } from '../validations/events-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { GetEventsActivitiesMiddleware, InsertEventTypeMiddleware, PostEventActivitiesMiddleware } from '../middleware/events-middleware.js';
import { ValidatePostActivities } from '../validations/activities-validations.js';
import { MemberPostActivityMiddleware } from '../middleware/members-middleware.js';
import { ValidateAddPermissionForEveryone, ValidatePatchMemberPermission, ValidatePatchRemovePermission } from '../validations/discussions-validations.js';
import { GetFilteredActivities, PostActivities } from '../controllers/activities-controller.js';
import { ValidateGetMembers, ValidateInviteMembers } from '../validations/members-validations.js';
import { DeleteSpeakers, GetSpeakerstoInvite, InviteSpeakersThroughEmail, PatchSpeakers, PostSpeakers } from '../controllers/speakers-controller.js';
const router = e.Router();

router.get('/events', decodeIDToken, ensureAuthorized("User"), ValidateGetEvents, QueryParameterFormatting,
    SwaggerDocs.get_Events,
    // @ts-ignore
    asyncHandler(GetEvents));

router.get('/events/:EventId', decodeIDToken, ensureAuthorized("User", "Admin", "SuperAdmin"),
    SwaggerDocs.get_Events_EventsId,
    // @ts-ignore
    asyncHandler(GetOneFromEvents));

router.post('/events', decodeIDToken, ensureAuthorized("Admin"), ValidatePostEvents,
    SwaggerDocs.post_Events,
    // @ts-ignore
    asyncHandler(PostEvents));

router.patch('/events/:EventId', decodeIDToken, ensureAuthorized("Admin"),
    // @ts-ignore
    asyncHandler(PatchEvents));

router.patch('/events/:EventId/coverPicture', decodeIDToken, ensureAuthorized("Admin"), ValidatePatchEventCoverPhoto,
    // @ts-ignore
    asyncHandler(PatchEvents));

router.get('/guest/events/', ValidateGetEvents, QueryParameterFormatting, SwaggerDocs.get_Guest_Events,
    //@ts-ignore
    asyncHandler(GetPublicEvents));

router.patch('/events/:EventId/member/permissions/everyone', decodeIDToken, ensureAuthorized("Admin"), ValidateAddPermissionForEveryone,
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

router.delete('/events/:EventId', decodeIDToken, ensureAuthorized("Admin"),
    // @ts-ignore
    asyncHandler(DeleteEvents));

/******************************************************************************SPEAKERS**************************************************************************************** */

router.post('/events/:EventId/speakers/:SpeakerId', decodeIDToken, ensureAuthorized("Admin"), ValidatePostSpeakers,
    SwaggerDocs.post_Events_EventId_Speakers,
    //@ts-ignore
    asyncHandler(PostSpeakers));

router.post('/events/:EventId/speakers/invite/email', decodeIDToken, ensureAuthorized("Admin"), ValidatePostSpeakerMailInvite,
    //@ts-ignore
    asyncHandler(InviteSpeakersThroughEmail))

router.patch('/events/:EventId/speakers', decodeIDToken, ensureAuthorized("Admin"),
    SwaggerDocs.patch_Events_EventId_Speakers,
    //@ts-ignore
    asyncHandler(PatchSpeakers));

router.get('/events/:EventId/speakers/invite', decodeIDToken, ensureAuthorized("Admin"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Events_EventId_Speakers_Invited,
    //@ts-ignore
    asyncHandler(GetSpeakerstoInvite));

router.delete('/events/:EventId/speakers/:SpeakerId/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Events_EventId_Speakers_SpeakerId,
    //@ts-ignore
    asyncHandler(DeleteSpeakers));


router.delete('/events/:EventId/speakers/:SpeakerId', decodeIDToken, ensureAuthorized("Admin"),
    SwaggerDocs.delete_Events_EventId_Speakers_SpeakerId,
    //@ts-ignore
    asyncHandler(DeleteSpeakers));




export default router;