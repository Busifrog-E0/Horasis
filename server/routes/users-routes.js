import {
    GetOneFromUsers, PostUsersRegister, PatchUsers, UserLogin,
    VerifyUserEmail,
    VerifyRegistrationOTP,
} from '../controllers/users-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostUsers, ValidateGetUsers, ValidatePatchUsers } from '../validations/users-validations.js';
import SwaggerDocs from '../swaggerDocs/users-swaggerDocs.js'
import e from 'express';
import { CheckSameUser } from '../middleware/common.js';
import { ValidateUserLogin, ValidateUserRegister, ValidateVerifyOTP } from '../validations/users-validations.js';
const router = e.Router();
router.route

router.get('/users/:UserId', decodeIDToken, ensureAuthorized("User"), CheckSameUser, SwaggerDocs.get_Users_UserId,
    // @ts-ignore
    asyncHandler(GetOneFromUsers));

router.post('/users/register', ValidateUserRegister, SwaggerDocs.post_Users_Register,
    // @ts-ignore
    asyncHandler(PostUsersRegister));

router.post('/users/verify', ValidateVerifyOTP, SwaggerDocs.post_Users_Verify,
    //@ts-ignore
asyncHandler(VerifyRegistrationOTP))

router.post('/users/login', ValidateUserLogin, SwaggerDocs.post_Users_Login,
    // @ts-ignore
    asyncHandler(UserLogin));

// resend verfication email api - vedanth


router.patch('/users/:UserId', decodeIDToken, ensureAuthorized("User"), CheckSameUser,
    // @ts-ignore
    asyncHandler(PatchUsers));


export default router;