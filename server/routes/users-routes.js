import {
    GetOneFromUsers, PostUsersRegister, PatchUsers, UserLogin,
    VerifyRegistrationOTP,
    CheckUsernameAvailability,
    GetUsers,
    SendForgotPasswordOTP,
    PatchPassword,
} from '../controllers/users-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostUsers, ValidateGetUsers, ValidatePatchUsers } from '../validations/users-validations.js';
import SwaggerDocs from '../swaggerDocs/users-swaggerDocs.js'
import e from 'express';
import { CheckSameUser, QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidateCheckUsername, ValidatePatchUsers, ValidateUserLogin, ValidatePatchUserPictures, ValidateUserRegister, ValidateVerifyOTP, ValidateGetUserMedia, ValidatePostForgotPassword, ValidatePasswordReset, ValidatePostUsersInvite, ValidateMailCheck, ValidateGetUsers } from '../validations/users-validations.js';
import { GetMedias } from '../controllers/medias-controller.js';
import { CheckOTP } from '../controllers/auth-controller.js';
import { GetNotifications, GetOneFromNotifications, GetUnreadNotification } from '../controllers/notifications-controller.js';
import {  InviteUserToCreateAccount } from '../controllers/invitations-controller.js';
const router = e.Router();
router.route

router.get('/users/:UserId', decodeIDToken, ensureAuthorized("User"), SwaggerDocs.get_Users_UserId,
    // @ts-ignore
    asyncHandler(GetOneFromUsers));

router.get('/users', decodeIDToken, ensureAuthorized("User"), ValidateGetUsers, QueryParameterFormatting,
    SwaggerDocs.get_Users,
    //@ts-ignore
    asyncHandler(GetUsers));

router.get('/users/:UserId/suggested', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Users_Suggested,
    //@ts-ignore
    asyncHandler(GetUsers));

router.post('/users/register', ValidateUserRegister, SwaggerDocs.post_Users_Register,
    // @ts-ignore
    asyncHandler(PostUsersRegister));

router.post('/users/verify', ValidateVerifyOTP, SwaggerDocs.post_Users_Verify,
    //@ts-ignore
    asyncHandler(VerifyRegistrationOTP))

router.post('/users/login', ValidateUserLogin, SwaggerDocs.post_Users_Login,
    // @ts-ignore
    asyncHandler(UserLogin));

router.post('/users/register/checkUsername', ValidateCheckUsername, SwaggerDocs.post_Users_CheckUsername,
    //@ts-ignore
    asyncHandler(CheckUsernameAvailability(false)));

router.post('/users/edit/checkUsername', decodeIDToken, ensureAuthorized("User"), ValidateCheckUsername, SwaggerDocs.post_Users_CheckUsername,
    //@ts-ignore
    asyncHandler(CheckUsernameAvailability(true)));

// resend verfication email api - vedanth

router.patch('/users/:UserId', decodeIDToken, ensureAuthorized("User"), ValidatePatchUsers, CheckSameUser,
    SwaggerDocs.patch_Users_UserId,
    // @ts-ignore
    asyncHandler(PatchUsers));

router.patch('/users/:UserId/picture', decodeIDToken, ensureAuthorized("User"), CheckSameUser, ValidatePatchUserPictures,
    SwaggerDocs.patch_Users_UserId_Picture,
    //@ts-ignore
    asyncHandler(PatchUsers))

router.get('/users/:UserId/media', decodeIDToken, ensureAuthorized("User"), ValidateGetUserMedia, QueryParameterFormatting,
    SwaggerDocs.get_Users_UserId_Media,
    //@ts-ignore
    asyncHandler(GetMedias))

router.post('/users/forgotPassword', ValidatePostForgotPassword, SwaggerDocs.post_Users_ForgotPassword,
    //@ts-ignore
    asyncHandler(SendForgotPasswordOTP));

router.post('/users/forgotPassword/verify', ValidateVerifyOTP, SwaggerDocs.post_Users_ForgotPassword_Verify,
    //@ts-ignore
    asyncHandler(CheckOTP));

router.post('/users/forgotPassword/reset', ValidatePasswordReset, SwaggerDocs.post_Users_ForgotPassword_Reset,
    //@ts-ignore
    asyncHandler(PatchPassword));

router.get('/users/:RecipientId/unreadNotification', decodeIDToken, ensureAuthorized("User"),
    //@ts-ignore
    asyncHandler(GetUnreadNotification));

router.get('/users/:RecipientId/notifications', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Users_UserId_Notifications,
    //@ts-ignore
    asyncHandler(GetNotifications));

router.get('/users/:RecipientId/notifications/:NotificationId', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.get_Users_UserId_Notifications_NotificationId,
    //@ts-ignore
    asyncHandler(GetOneFromNotifications));

router.post('/users/invite', decodeIDToken, ensureAuthorized("User"), ValidatePostUsersInvite, SwaggerDocs.post_Users_Invite,
    //@ts-ignore
    asyncHandler(InviteUserToCreateAccount));



export default router;