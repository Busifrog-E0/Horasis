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
import { CheckSameUserInBody, CheckSameUserInEntity, QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import {
    AcceptJoinRequest, AcceptMemberInvitation, DeleteMembers, DeleteTempMembers,
    GetJoinRequests, GetMembers, GetMembersToInvite, InviteMembers, PostMembers, RemoveMemberPermissions, UpdateMemberPermissions
} from '../controllers/members-controller.js';
import { GetDiscussionsActivitiesMiddleware, InsertDiscussionTypeMiddleware, PostDiscussionActivitiesMiddleware } from '../middleware/discussions-middleware.js';
import { GetActivities, GetFilteredActivities, PostActivities } from '../controllers/activities-controller.js';
import { ValidatePostActivities } from '../validations/activities-validations.js';
import { MemberPostActivityMiddleware } from '../middleware/members-middleware.js';
import { DeleteSaves, GetSaves, PostSaves } from '../controllers/saves-controller.js';
import { ValidateGetMembers, ValidateInviteMembers } from '../validations/members-validations.js';
const router = e.Router();


router.get('/discussions', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Discussions,
    //@ts-ignore
    asyncHandler(GetDiscussions));

router.get('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User", "Admin", "SuperAdmin"),
    // @ts-ignore
    asyncHandler(GetOneFromDiscussions));

router.post('/discussions', decodeIDToken, ensureAuthorized("User"), ValidatePostDiscussion, SwaggerDocs.post_Discussion,
    // @ts-ignore
    asyncHandler(PostDiscussions));

router.patch('/discussions/:DiscussionId/coverPicture', decodeIDToken, ensureAuthorized("User"),
    CheckSameUserInEntity(GetOneFromDiscussions, "DiscussionId"), ValidatePatchDiscussionCoverPhoto,
    SwaggerDocs.patch_Discussion_DiscussionId_CoverPicture,
    // @ts-ignore
    asyncHandler(PatchDiscussions));

router.get('/guest/discussions/', ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Guest_Discussions,
    //@ts-ignore
    asyncHandler(GetPublicDiscussions));


router.patch('/discussions/:DiscussionId/member/permissions/everyone', decodeIDToken, ensureAuthorized("User"), ValidateAddPermissionForEveryone,
    CheckSameUserInEntity(GetOneFromDiscussions, "DiscussionId"), SwaggerDocs.patch_Discussions_EntityId_Member_Permissions_Everyone,
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

/************************************************************************ACTIVITIES************************************************************************* */

router.post('/discussions/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidatePostActivities, CheckSameUserInBody, PostDiscussionActivitiesMiddleware,
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