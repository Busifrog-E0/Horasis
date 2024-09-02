import {
     GetFollows, PostFollows,  DeleteFollows,
    GetFollowNumber,
} from '../controllers/follow-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateFollow, } from '../validations/follow-validations.js';
import SwaggerDocs from '../swaggerDocs/follow-swaggerDocs.js'

import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();
router.route

router.get('/users/:UserId/followers', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Followers,
    //@ts-ignore
    asyncHandler(GetFollows(true)));

router.get('/users/:UserId/followings', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Followings,
    //@ts-ignore
    asyncHandler(GetFollows(false)));

router.post('/follow', decodeIDToken, ensureAuthorized("User"), ValidateFollow, SwaggerDocs.post_Follow,
    // @ts-ignore
    asyncHandler(PostFollows));

router.delete('/users/:UserId/follow/:FolloweeId', decodeIDToken, ensureAuthorized("User"), SwaggerDocs.delete_Follow,
    // @ts-ignore
    asyncHandler(DeleteFollows));

router.get('/users/:UserId/follow/count', decodeIDToken, ensureAuthorized("User"), SwaggerDocs.get_Follow_Count,
    //@ts-ignore,
    asyncHandler(GetFollowNumber))

export default router;