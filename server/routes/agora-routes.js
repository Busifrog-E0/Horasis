import { generateRTCToken } from '../controllers/agora-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';


import e from 'express';
const router = e.Router();
router.route

router.get('/event/:EventId/videoCall/join', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(generateRTCToken));

export default router;