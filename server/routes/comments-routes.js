import {
    GetOneFromComments, GetComments, PostComments, PatchComments, DeleteComments,
} from '../controllers/comments-controller.js';
import asyncHandler from 'express-async-handler';

// import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostComments, ValidateGetComments, ValidatePatchComments } from '../validations/comments-validations.js';
import SwaggerDocs from '../swaggerDocs/comments-swaggerDocs.js';
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidatePostComments } from '../validations/comments-validations.js';
const router = e.Router();
router.route

router.get('/comments/:ParentId', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,SwaggerDocs.get_Comments,
    //@ts-ignore
    asyncHandler(GetComments));

router.get('/comments/:CommentId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.get_Comments_CommentId,
    // @ts-ignore
    asyncHandler(GetOneFromComments));

router.post('/comments/:ActivityId', decodeIDToken, ensureAuthorized("User"),ValidatePostComments,SwaggerDocs.post_Comments,
    // @ts-ignore
    asyncHandler(PostComments));

router.post('/comments/:ActivityId/reply/:CommentId', decodeIDToken, ensureAuthorized("User"), ValidatePostComments, SwaggerDocs.post_Comments,
    // @ts-ignore
    asyncHandler(PostComments));    

router.patch('/comments/:CommentId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(PatchComments));

router.delete('/comments/:CommentId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.delete_Comments_CommentId,
    // @ts-ignore
    asyncHandler(DeleteComments));

export default router;