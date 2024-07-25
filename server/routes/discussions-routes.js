import {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
} from '../controllers/discussions-controller.js';
import asyncHandler from 'express-async-handler';


import SwaggerDocs from '../swaggerDocs/discussions-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePatchDiscussionCoverPhoto, ValidatePatchMemberPermission, ValidatePostDiscussion } from '../validations/discussions-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { AcceptMemberInvitation, CancelInvitation, DeclineInvitation, DeleteMembers, GetMembers, InviteMembers, PostMembers, UpdateMemberPermissions } from '../controllers/members-controller.js';
import { DiscussionJoinMiddleware, GetDiscussionsActivitiesMiddleware, PostDiscussionActivitiesMiddleware } from '../middleware/discussions-middleware.js';
import { GetFilteredActivities, PostActivities } from '../controllers/activities-controller.js';
import { ValidatePostActivities } from '../validations/activities-validations.js';
import { MemberPostActivityMiddleware } from '../middleware/members-middleware.js';
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

router.post('/discussions/:EntityId/join', decodeIDToken, ensureAuthorized("User"),DiscussionJoinMiddleware,
    SwaggerDocs.post_Discussions_EntityId_Join,
    //@ts-ignore
    asyncHandler(PostMembers));

router.post('/discussions/:EntityId/invite/:InviteeId', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.post_Discussions_EntityId_Invite_InviteeId,
    //@ts-ignore
    asyncHandler(InviteMembers));

router.patch('/discussions/:EntityId/invite/accept', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.patch_Discussions_EntityId_Invite_Accept,
    //@ts-ignore
    asyncHandler(AcceptMemberInvitation));

router.delete('/discussions/:EntityId/invite/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Discussions_DiscussionId_Invite_Reject,
    //@ts-ignore
    asyncHandler(DeclineInvitation));

router.delete('/discussions/:EntityId/invite/:InviteeId/cancel', decodeIDToken, ensureAuthorized("User"),
 SwaggerDocs.delete_Discussions_DiscussionId_Invite_Cancel,
    // @ts-ignore
    asyncHandler(CancelInvitation));

router.delete('/discussions/:EntityId/leave', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Discussions_DiscussionId_Leave,
    // @ts-ignore
    asyncHandler(DeleteMembers));    

router.get('/discussions/:EntityId/members', decodeIDToken, ensureAuthorized("User"),
    ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Discussions_DiscussionId_Members,
    //@ts-ignore
    asyncHandler(GetMembers)); 

router.patch('/discussions/:EntityId/member/permissions', decodeIDToken, ensureAuthorized("User"), ValidatePatchMemberPermission,
    SwaggerDocs.patch_Discussions_EntityId_Member_Permissions,
    //@ts-ignore
    asyncHandler(UpdateMemberPermissions));

router.post('/discussions/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidatePostActivities, PostDiscussionActivitiesMiddleware,
    MemberPostActivityMiddleware, SwaggerDocs.post_Discussions_DiscussionId_Activities,
    //@ts-ignore
    asyncHandler(PostActivities));

router.get('/discussions/:EntityId/activities', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    GetDiscussionsActivitiesMiddleware,SwaggerDocs.get_Discussions_DiscussionId_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.delete('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteDiscussions));

export default router;