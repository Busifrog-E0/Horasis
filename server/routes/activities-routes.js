import {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    GetUserActivities,
} from '../controllers/activities-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostActivities, ValidatePatchActivities } from '../validations/activities-validations.js';
import SwaggerDocs from '../swaggerDocs/activities-swaggerDocs.js'
import e from 'express';
import { CheckSameUser, QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { GetFeedActivitiesMiddleware, PostFeedActivitiesMiddleware } from '../middleware/activities-middleware.js';
import { DeleteLikes, GetLikes, PostLikes } from '../controllers/likes-controller.js';
import { DeleteSaves, GetSaves, PostSaves } from '../controllers/saves-controller.js';
const router = e.Router();

router.get('/activities', decodeIDToken, ensureAuthorized("User"),GetFeedActivitiesMiddleware ,ValidateGetEntity, QueryParameterFormatting,SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetActivities));

router.get('/user/:UserId/activities', decodeIDToken, ensureAuthorized("User"), GetFeedActivitiesMiddleware, ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetUserActivities));    

router.get('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.get_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(GetOneFromActivities));

router.post('/activities', decodeIDToken, ensureAuthorized("User"),PostFeedActivitiesMiddleware,ValidatePostActivities,SwaggerDocs.post_Activities,
    // @ts-ignore
    asyncHandler(PostActivities));

router.patch('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"), ValidatePatchActivities,SwaggerDocs.patch_Activities,
    // @ts-ignore
    asyncHandler(PatchActivities));

router.post('/users/:UserId/activities/:ActivityId/like', decodeIDToken, ensureAuthorized("User"),CheckSameUser, SwaggerDocs.patch_Activities_ActivityId_Like,
    // @ts-ignore
    asyncHandler(PostLikes));
    
router.delete('/users/:UserId/activities/:ActivityId/dislike', decodeIDToken, ensureAuthorized("User"),CheckSameUser, SwaggerDocs.patch_Activities_ActivityId_Dislike,
    // @ts-ignore
    asyncHandler(DeleteLikes)); 
    

router.post('/users/:UserId/activities/:ActivityId/save', decodeIDToken, ensureAuthorized("User"), CheckSameUser, SwaggerDocs.patch_Activities_ActivityId_Like,
    // @ts-ignore
    asyncHandler(PostSaves));

router.delete('/users/:UserId/activities/:ActivityId/save', decodeIDToken, ensureAuthorized("User"), CheckSameUser, SwaggerDocs.patch_Activities_ActivityId_Dislike,
    // @ts-ignore
    asyncHandler(DeleteSaves));      

router.get('/activities/:ActivityId/likedUsers', decodeIDToken, ensureAuthorized("User"),ValidateGetEntity,QueryParameterFormatting, SwaggerDocs.get_Activities_ActivityId_LikedUsers,
    //@ts-ignore
    asyncHandler(GetLikes))  

router.get('user/:UserId/activities/save', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetSaves))     

router.delete('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.delete_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(DeleteActivities));

export default router;