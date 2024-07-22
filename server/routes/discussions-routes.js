import {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
} from '../controllers/discussions-controller.js';
import asyncHandler from 'express-async-handler';


import SwaggerDocs from '../swaggerDocs/discussion-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePatchDiscussionCoverPhoto, ValidatePostDiscussion } from '../validations/discussions-validations.js';
const router = e.Router();


router.get('/discussions', decodeIDToken, ensureAuthorized("User"),
    //@ts-ignore
    asyncHandler(GetDiscussions));

router.get('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromDiscussions));

router.post('/discussions', decodeIDToken, ensureAuthorized("User"), ValidatePostDiscussion, SwaggerDocs.post_Discussion,
    // @ts-ignore
    asyncHandler(PostDiscussions));

router.patch('/discussions/:DiscussionId/coverPicture', decodeIDToken, ensureAuthorized("User"), ValidatePatchDiscussionCoverPhoto,
    SwaggerDocs.patch_Discussion_DiscussionId_CoverPicture,
    // @ts-ignore
    asyncHandler(PatchDiscussions));

router.delete('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteDiscussions));

export default router;