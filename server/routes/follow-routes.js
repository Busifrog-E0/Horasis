import {
    GetOneFromFollows, GetFollows, PostFollows, PatchFollows, DeleteFollows,
} from '../controllers/follow-controller.js';
import asyncHandler from 'express-async-handler';

 import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateFollow, } from '../validations/follow-validations.js';
import SwaggerDocs from '../swaggerDocs/follow-swaggerDocs.js'

import e from 'express';
const router = e.Router();
router.route

router.get('/follow', GetFollows);

router.post('/follow',decodeIDToken,ensureAuthorized("User"),ValidateFollow,SwaggerDocs.post_Follow,
    // @ts-ignore
    asyncHandler(PostFollows));

router.delete('/follow',decodeIDToken,ensureAuthorized("User"),ValidateFollow,SwaggerDocs.delete_Follow,
    // @ts-ignore
    asyncHandler(DeleteFollows));

export default router;