import { generateRTCToken, GetParticipants } from '../controllers/agora-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';


import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();
router.route

router.get('/event/:EventId/videoCall/join', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(generateRTCToken));

router.get('/events/:EventId/videoCall/participants', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    // @ts-ignore
    asyncHandler(GetParticipants))

export default router;