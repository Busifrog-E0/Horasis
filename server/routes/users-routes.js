import {
    GetOneFromUsers, PostUsersRegister, PatchUsers, UserLogin,
    VerifyRegistrationOTP,
    CheckUsernameAvailability,
    GetUsers,
} from '../controllers/users-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostUsers, ValidateGetUsers, ValidatePatchUsers } from '../validations/users-validations.js';
import SwaggerDocs from '../swaggerDocs/users-swaggerDocs.js'
import e from 'express';
import { CheckSameUser, QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidateCheckUsername, ValidatePatchUsers, ValidateUserLogin, ValidatePatchUserPictures, ValidateUserRegister, ValidateVerifyOTP } from '../validations/users-validations.js';
const router = e.Router();
router.route

router.get('/users/:UserId', decodeIDToken, ensureAuthorized("User"), SwaggerDocs.get_Users_UserId,
    // @ts-ignore
    asyncHandler(GetOneFromUsers));

router.get('/users', decodeIDToken, ensureAuthorized("Users"), QueryParameterFormatting, ValidateGetEntity,
    SwaggerDocs.get_Users,
    //@ts-ignore
    asyncHandler(GetUsers)); 

router.get('/users/suggested', decodeIDToken, ensureAuthorized("Users"), QueryParameterFormatting, ValidateGetEntity, 
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

router.post('/users/register/checkUsername',ValidateCheckUsername,SwaggerDocs.post_Users_CheckUsername,
    //@ts-ignore
    asyncHandler(CheckUsernameAvailability(false)));

router.post('/users/edit/checkUsername', decodeIDToken,ensureAuthorized("User"),ValidateCheckUsername, SwaggerDocs.post_Users_CheckUsername,
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


export default router;