import {
    GetOneFromDiscussions, GetDiscussions, PostDiscussions, PatchDiscussions, DeleteDiscussions,
} from '../controllers/discussions-controller.js';
import asyncHandler from 'express-async-handler';

// import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostDiscussions, ValidateGetDiscussions, ValidatePatchDiscussions } from '../validations/discussions-validations.js';

import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostDiscussion } from '../validations/discussions-validations';
const router = e.Router();


router.get('/discussions', decodeIDToken, ensureAuthorized("User"),
    //@ts-ignore
    asyncHandler(GetDiscussions));

router.get('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromDiscussions));

router.post('/discussions', decodeIDToken, ensureAuthorized("User"),ValidatePostDiscussion,
    // @ts-ignore
    asyncHandler(PostDiscussions));

router.patch('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(PatchDiscussions));

router.delete('/discussions/:DiscussionId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteDiscussions));

export default router;