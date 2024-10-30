import {
    GetOneFromTags, GetTags, PostTags, PatchTags, DeleteTags,
} from '../controllers/tags-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
 import { ValidatePostTags,  } from '../validations/tags-validations.js';

import e from 'express';
const router = e.Router();

router.get('/tags', decodeIDToken, ensureAuthorized("User", "Admin"),
    //@ts-ignore
    asyncHandler(GetTags));

router.get('/tags/:TagId',
    // @ts-ignore
    asyncHandler(GetOneFromTags));

router.post('/tags', decodeIDToken, ensureAuthorized("Admin"),ValidatePostTags,
    // @ts-ignore
    asyncHandler(PostTags));

router.patch('/tags/:TagId',
    // @ts-ignore
    asyncHandler(PatchTags));

router.delete('/tags/:TagId', decodeIDToken, ensureAuthorized("Admin"),
    // @ts-ignore
    asyncHandler(DeleteTags));

export default router;