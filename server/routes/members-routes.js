import {
    AcceptJoinRequest, AcceptMemberInvitation, DeleteMembers, DeleteTempMembers,
    GetJoinRequests, GetMembers, GetMembersToInvite, InviteMembers, PostMembers, RemoveMemberPermissions, UpdateMemberPermissions
} from '../controllers/members-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostMembers, ValidateGetMembers, ValidatePatchMembers } from '../validations/members-validations.js';
import SwaggerDocs from '../swaggerDocs/members-swaggerDocs.js';
import e from 'express';
import { ValidateGetMembers, ValidateInviteMembers, ValidatePostMembers } from '../validations/members-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidateAddPermissionForEveryone, ValidatePatchMemberPermission, ValidatePatchRemovePermission } from '../validations/discussions-validations.js';
const router = e.Router();
router.route

router.post('/members/:EntityId/join', decodeIDToken, ensureAuthorized("User"), ValidatePostMembers,
    SwaggerDocs.post_Members_EntityId_Join,
    //@ts-ignore
    asyncHandler(PostMembers));

router.delete('/members/:EntityId/join/:UserId/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Members_EntityId_Join_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.patch('/members/:EntityId/join/:UserId/accept', decodeIDToken, ensureAuthorized("User"), ValidatePostMembers,
    SwaggerDocs.patch_Members_EntityId_Join_Accept,
    //@ts-ignore
    asyncHandler(AcceptJoinRequest));


router.get('/members/:EntityId/members/requested', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Members_EntityId_Members_Requested,
    //@ts-ignore
    asyncHandler(GetJoinRequests));



router.delete('/members/:EntityId/join/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), 
    SwaggerDocs.delete_Member_EntityId_Join_Cancel,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

/****************************************************************INVITE************************************************************************************************** */

router.get('/members/:EntityId/members/invite', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Members_EntityId_Members_Invited,
    //@ts-ignore
    asyncHandler(GetMembersToInvite));

router.post('/members/:EntityId/invite/:InviteeId', decodeIDToken, ensureAuthorized("User"), ValidateInviteMembers, 
    SwaggerDocs.post_Members_EntityId_Invite_InviteeId,
    //@ts-ignore
    asyncHandler(InviteMembers));

router.patch('/members/:EntityId/invite/accept', decodeIDToken, ensureAuthorized("User"), ValidatePostMembers,
    SwaggerDocs.patch_Members_EntityId_Invite_Accept,
    //@ts-ignore
    asyncHandler(AcceptMemberInvitation));

router.delete('/members/:EntityId/invite/:UserId/reject', decodeIDToken, ensureAuthorized("User"), 
    SwaggerDocs.delete_Members_EntityId_Invite_Reject,
    //@ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/members/:EntityId/invite/:UserId/cancel', decodeIDToken, ensureAuthorized("User"), 
    SwaggerDocs.delete_Members_EntityId_Invite_Cancel,
    // @ts-ignore
    asyncHandler(DeleteTempMembers));

router.delete('/members/:EntityId/leave', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Members_EntityId_Leave,
    // @ts-ignore
    asyncHandler(DeleteMembers));

/*****************************************************MEMBERS************************************************************************************* */
router.get('/members/:EntityId', decodeIDToken, ensureAuthorized("User"),
    ValidateGetMembers, QueryParameterFormatting, SwaggerDocs.get_Members_EntityId_Members,
    //@ts-ignore
    asyncHandler(GetMembers));

router.patch('/members/:EntityId/permissions', decodeIDToken, ensureAuthorized("User"), ValidatePatchMemberPermission,
    SwaggerDocs.patch_Members_EntityId_Member_Permissions,
    //@ts-ignore
    asyncHandler(UpdateMemberPermissions));

router.patch('/members/:EntityId/permissions/:MemberId/remove', decodeIDToken, ensureAuthorized("User"), ValidatePatchRemovePermission,
    SwaggerDocs.patch_Members_EntityId_Member_Permissions_Remove,
    //@ts-ignore
    asyncHandler(RemoveMemberPermissions));




export default router;