import {
    GetOneFromTags, GetTags, PostTags, PatchTags, DeleteTags,
} from '../controllers/tags-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostTags, } from '../validations/tags-validations.js';

import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();

router.get('/tags', decodeIDToken, ensureAuthorized("User", "Admin", "SuperAdmin"),ValidateGetEntity,QueryParameterFormatting,
    //@ts-ignore
    asyncHandler(GetTags));

router.get('/tags/:TagId',
    // @ts-ignore
    asyncHandler(GetOneFromTags));

router.post('/tags', decodeIDToken, ensureAuthorized("Admin", "SuperAdmin"), ValidatePostTags,
    // @ts-ignore
    asyncHandler(PostTags));

router.patch('/tags/:TagId',
    // @ts-ignore
    asyncHandler(PatchTags));

router.delete('/tags/:TagId', decodeIDToken, ensureAuthorized("Admin", "SuperAdmin"),
    // @ts-ignore
    asyncHandler(DeleteTags));

export default router;