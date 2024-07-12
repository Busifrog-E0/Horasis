import {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
} from '../controllers/activities-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
 import { ValidatePostActivities, ValidatePatchActivities } from '../validations/activities-validations.js';

import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common';
const router = e.Router();
router.route

router.get('/activities', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    //@ts-ignore
asyncHandler(GetActivities));

router.get('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromActivities));

router.post('/activities', decodeIDToken, ensureAuthorized("User"),ValidatePostActivities,
    // @ts-ignore
    asyncHandler(PostActivities));

router.patch('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),ValidatePatchActivities,
    // @ts-ignore
    asyncHandler(PatchActivities));

router.delete('/activities/:ActivityId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteActivities));

export default router;