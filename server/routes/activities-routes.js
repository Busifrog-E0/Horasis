import {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    GetFilteredActivities,
} from '../controllers/activities-controller.js';
import asyncHandler from 'express-async-handler';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostActivities, ValidatePatchActivities, ValidateGetActivities } from '../validations/activities-validations.js';
import SwaggerDocs from '../swaggerDocs/activities-swaggerDocs.js'
import e from 'express';
import { CheckSameUserInBody, CheckSameUserInEntity, QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { GetFeedActivitiesMiddleware, GetMentionedActivitiesMiddleware, GetUserActivitiesMiddleware, InsertActivityTypeMiddleware, PostActivitiesLikeMiddleware, PostFeedActivitiesMiddleware } from '../middleware/activities-middleware.js';

const router = e.Router();

router.get('/feed', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, GetFeedActivitiesMiddleware, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetActivities));

router.get('/activities', decodeIDToken, ensureAuthorized("User"), ValidateGetActivities, QueryParameterFormatting, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.get('/user/:UserId/activities', decodeIDToken, ensureAuthorized("User"), GetFeedActivitiesMiddleware, ValidateGetActivities, QueryParameterFormatting,
    GetUserActivitiesMiddleware, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.get('/user/:UserId/mentions/activities', decodeIDToken, ensureAuthorized("User"), GetFeedActivitiesMiddleware, ValidateGetActivities, QueryParameterFormatting,
    GetMentionedActivitiesMiddleware, SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetFilteredActivities));

router.get('/activities/search', decodeIDToken, ensureAuthorized("User"), GetFeedActivitiesMiddleware, ValidateGetActivities, QueryParameterFormatting,
    //@ts-ignore
    asyncHandler(GetFilteredActivities))

router.get('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User", "Admin", "SuperAdmin"), SwaggerDocs.get_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(GetOneFromActivities));

router.post('/activities', decodeIDToken, ensureAuthorized("User"), ValidatePostActivities, CheckSameUserInBody, PostFeedActivitiesMiddleware, SwaggerDocs.post_Activities,
    // @ts-ignore
    asyncHandler(PostActivities));

router.patch('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"), ValidatePatchActivities,
    CheckSameUserInEntity(GetOneFromActivities, "ActivityId"), SwaggerDocs.patch_Activities,
    // @ts-ignore
    asyncHandler(PatchActivities));


router.delete('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User", "Admin", "SuperAdmin"),
    CheckSameUserInEntity(GetOneFromActivities, "ActivityId"), SwaggerDocs.delete_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(DeleteActivities));

export default router;