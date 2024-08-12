import {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
    GetUserDiscussions,
    GetInvitedDiscussions,
    GetPublicDiscussions,
} from '../controllers/discussions-controller.js';
import asyncHandler from 'express-async-handler';


import SwaggerDocs from '../swaggerDocs/discussions-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateAddPermissionForEveryone, ValidatePatchDiscussionCoverPhoto, ValidatePatchMemberPermission, ValidatePatchRemovePermission, ValidatePostDiscussion } from '../validations/discussions-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import {
    AcceptJoinRequest, AcceptMemberInvitation, DeleteMembers, DeleteTempMembers,
    GetJoinRequests, GetMembers, GetMembersToInvite, InviteMembers, PostMembers, RemoveMemberPermissions, UpdateMemberPermissions
} from '../controllers/members-controller.js';
import { GetDiscussionsActivitiesMiddleware, InsertDiscussionTypeMiddleware, PostDiscussionActivitiesMiddleware } from '../middleware/discussions-middleware.js';
import { GetActivities, GetFilteredActivities, PostActivities } from '../controllers/activities-controller.js';
import { ValidatePostActivities } from '../validations/activities-validations.js';
import { MemberPostActivityMiddleware } from '../middleware/members-middleware.js';
import { DeleteSaves, GetSaves, PostSaves } from '../controllers/saves-controller.js';
const router = e.Router();


router.get('/discussions', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Discussions,
    //@ts-ignore
    asyncHandler(GetDiscussions));

router.get('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromDiscussions));

router.post('/discussions', decodeIDToken, ensureAuthorized("User"), ValidatePostDiscussion, SwaggerDocs.post_Discussion,
    // @ts-ignore
    asyncHandler(PostDiscussions));

router.patch('/discussions/:DiscussionId/coverPicture', decodeIDToken, ensureAuthorized("User"), ValidatePatchDiscussionCoverPhoto,
    SwaggerDocs.patch_Discussion_DiscussionId_CoverPicture,
    // @ts-ignore
    asyncHandler(PatchDiscussions));

router.get('/guest/discussions/', ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Guest_Discussions,
    //@ts-ignore
    asyncHandler(GetPublicDiscussions));

/**************************************************************************JOIN******************************************************************* */

router.post('/discussions/:EntityId/join', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.post_Discussions_EntityId_Join,
    //@ts-ignore
    asyncHandler(PostMembers));

router.delete('/discussions/:EntityId/join/:UserId/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Discussions_DiscussionId_Join_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.patch('/discussions/:EntityId/join/:UserId/accept', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.patch_Discussions_DiscussionId_Join_Accept,
    //@ts-ignore
    asyncHandler(AcceptJoinRequest));


router.get('/discussions/:EntityId/members/requested', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Discussions_DiscussionId_Members_Requested,
    //@ts-ignore
    asyncHandler(GetJoinRequests));



router.delete('/discussions/:EntityId/join/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.delete_Discussion_DiscussionId_Join_Cancel,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

/****************************************************************INVITE************************************************************************************************** */

router.get('/discussions/:EntityId/members/invite', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Discussions_DiscussionId_Members_Invited,
    //@ts-ignore
    asyncHandler(GetMembersToInvite));

router.post('/discussions/:EntityId/invite/:InviteeId', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.post_Discussions_EntityId_Invite_InviteeId,
    //@ts-ignore
    asyncHandler(InviteMembers));

router.patch('/discussions/:EntityId/invite/accept', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.patch_Discussions_EntityId_Invite_Accept,
    //@ts-ignore
    asyncHandler(AcceptMemberInvitation));

router.delete('/discussions/:EntityId/invite/:UserId/reject', decodeIDToken, ensureAuthorized("User"), // changes
    SwaggerDocs.delete_Discussions_DiscussionId_Invite_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/discussions/:EntityId/invite/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), // changes
    SwaggerDocs.delete_Discussions_DiscussionId_Invite_Cancel,
    // @ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/discussions/:EntityId/leave', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.delete_Discussions_DiscussionId_Leave,
    // @ts-ignore
    asyncHandler(DeleteMembers));

/*****************************************************MEMBERS************************************************************************************* */
router.get('/discussions/:EntityId/members', decodeIDToken, ensureAuthorized("User"),
    ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Discussions_DiscussionId_Members,
    //@ts-ignore
    asyncHandler(GetMembers));

router.patch('/discussions/:EntityId/member/permissions', decodeIDToken, ensureAuthorized("User"), ValidatePatchMemberPermission,
    SwaggerDocs.patch_Discussions_EntityId_Member_Permissions,
    //@ts-ignore
    asyncHandler(UpdateMemberPermissions));

router.patch('/discussions/:EntityId/member/permissions/remove', decodeIDToken, ensureAuthorized("User"), ValidatePatchRemovePermission,
    SwaggerDocs.patch_Discussions_EntityId_Member_Permissions_Remove,
    //@ts-ignore
    asyncHandler(RemoveMemberPermissions));

router.patch('/discussions/:EntityId/member/permissions/everyone', decodeIDToken, ensureAuthorized("User"), ValidateAddPermissionForEveryone,
    SwaggerDocs.patch_Discussions_EntityId_Member_Permissions_Everyone,
    //@ts-ignore
    asyncHandler(PatchDiscussions));

/*********************************************************************FILTERED DISCUSSIONS********************************************************************* */

router.get('/user/:UserId/discussions', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_User_UserId_Discussions,
    //@ts-ignore
    asyncHandler(GetUserDiscussions))

router.get('/user/:UserId/discussions/invited', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Discussions_Invited,
    //@ts-ignore
    asyncHandler(GetInvitedDiscussions));

/***************************************************************SAVE************************************************************************************* */

router.post('/discussions/:EntityId/save', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.post_Discussions_DiscussionId_Save,
    //@ts-ignore
    asyncHandler(PostSaves));

router.get('/users/:UserId/discussions/save', decodeIDToken, ensureAuthorized("User"), InsertDiscussionTypeMiddleware,
    SwaggerDocs.get_Discussions_DiscussionId_Save,
    //@ts-ignore
    asyncHandler(GetSaves));

router.delete('/users/:UserId/discussions/save', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Discussions_DiscussionId_Save,
    //@ts-ignore
    asyncHandler(DeleteSaves));

/************************************************************************ACTIVITIES************************************************************************* */

router.post('/discussions/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidatePostActivities, PostDiscussionActivitiesMiddleware,
    MemberPostActivityMiddleware, SwaggerDocs.post_Discussions_DiscussionId_Activities,
    //@ts-ignore
    asyncHandler(PostActivities));

router.get('/discussions/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    GetDiscussionsActivitiesMiddleware, SwaggerDocs.get_Discussions_DiscussionId_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.delete('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteDiscussions));

export default router;