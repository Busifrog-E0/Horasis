import {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
} from '../controllers/activities-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostActivities, ValidatePatchActivities } from '../validations/activities-validations.js';
import SwaggerDocs from '../swaggerDocs/activities-swaggerDocs.js'
import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { GetFeedActivitiesMiddleware, PostFeedActivitiesMiddleware } from '../middleware/activities-middleware.js';
const router = e.Router();

router.get('/activities', decodeIDToken, ensureAuthorized("User"),GetFeedActivitiesMiddleware ,ValidateGetEntity, QueryParameterFormatting,SwaggerDocs.get_Activities,
    //@ts-ignore
    asyncHandler(GetActivities));

router.get('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.get_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(GetOneFromActivities));

router.post('/activities', decodeIDToken, ensureAuthorized("User"),PostFeedActivitiesMiddleware,ValidatePostActivities,SwaggerDocs.post_Activities,
    // @ts-ignore
    asyncHandler(PostActivities));

router.patch('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"), ValidatePatchActivities,SwaggerDocs.patch_Activities,
    // @ts-ignore
    asyncHandler(PatchActivities));

router.delete('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.delete_Activities_ActivityId,
    // @ts-ignore
    asyncHandler(DeleteActivities));

export default router;