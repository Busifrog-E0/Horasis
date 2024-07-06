import {
    GetOneFromUsers, GetUsers, PostUsers, PatchUsers, DeleteUsers,
    UserLogin,
    VerifyUserEmail,
} from '../controllers/users-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostUsers, ValidateGetUsers, ValidatePatchUsers } from '../validations/users-validations.js';
import SwaggerDocs from '../swaggerDocs/users-swaggerDocs.js'
import e from 'express';
import { CheckSameUser } from '../middleware/common.js';
import { ValidateUserLogin, ValidateUserRegister } from '../validations/users-validations.js';
const router = e.Router();
router.route

router.get('/users/:UserId', decodeIDToken, ensureAuthorized("User"), CheckSameUser, SwaggerDocs.get_Users_UserId,
    // @ts-ignore
    asyncHandler(GetOneFromUsers));

router.post('/users/register', ValidateUserRegister, SwaggerDocs.post_Users_Register,
    // @ts-ignore
    asyncHandler(PostUsers));

router.post('/users/login', ValidateUserLogin, SwaggerDocs.post_Users_Login,
    // @ts-ignore
    asyncHandler(UserLogin));

router.get('users/verify/:EmailVerificationId',
    //@ts-ignore
    asyncHandler(VerifyUserEmail)
)
router.patch('/users/:UserId', decodeIDToken, ensureAuthorized("User"), CheckSameUser,
    // @ts-ignore
    asyncHandler(PatchUsers));

router.delete('/users/:UserId', decodeIDToken, ensureAuthorized("User"), CheckSameUser,
    // @ts-ignore
    asyncHandler(DeleteUsers));

export default router;