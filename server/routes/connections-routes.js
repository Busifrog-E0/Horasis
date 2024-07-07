import {
    PostSendRequest, GetAUsersConnections,
} from '../controllers/connections-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostConnections, ValidateGetConnections, ValidatePatchConnections } from '../validations/connections-validations.js';

import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();

router.get('/users/:UserId/connections', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity,
    QueryParameterFormatting, GetAUsersConnections);

router.post('/connections/sendRequest', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(PostSendRequest));


router.post('/connections/acceptRequest', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(PostAcceptRequest));



export default router;