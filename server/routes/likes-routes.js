import {
    GetOneFromLikes, GetLikes, PostLikes, PatchLikes, DeleteLikes,
} from '../controllers/likes-controller.js';
import asyncHandler from 'express-async-handler';

// import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostLikes, ValidateGetLikes, ValidatePatchLikes } from '../validations/likes-validations.js';

import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidatePostLikes } from '../validations/likes-validations.js';
const router = e.Router();
router.route

router.get('/likes/:EntityId', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    //@ts-ignore
    asyncHandler(GetLikes));

router.get('/likes/:LikeId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromLikes));

router.post('/likes', decodeIDToken, ensureAuthorized("User"), ValidatePostLikes,
    // @ts-ignore
    asyncHandler(PostLikes));

router.patch('/likes/:LikeId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(PatchLikes));

router.delete('/likes/:EntityId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteLikes));


export default router;