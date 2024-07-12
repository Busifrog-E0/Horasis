import {
    GetAUsersConnections, PostConnectionSend, PostConnectionAccept, DeleteConnectionReject,
    DeleteConnectionCancel, DeleteConnection,
} from '../controllers/connections-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { GetConnections, GetConnectionsReceived, GetConnectionsSent } from '../middleware/connections-middleware.js';
// import { ValidatePostConnections, ValidateGetConnections, ValidatePatchConnections } from '../validations/connections-validations.js';
import SwaggerDocs from '../swaggerDocs/connections-swaggerDocs.js'

import e from 'express';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();


router.get('/users/:UserId/connections', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity,
    SwaggerDocs.get_users_UserId_connections, QueryParameterFormatting, GetConnections,
    GetAUsersConnections);

router.get('/users/:UserId/connections/received', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity,
    QueryParameterFormatting, GetConnectionsReceived, SwaggerDocs.get_users_UserId_connections,
    GetAUsersConnections);

router.get('/users/:UserId/connections/sent', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity,
    QueryParameterFormatting, GetConnectionsSent, SwaggerDocs.get_users_UserId_connections,
    GetAUsersConnections);

router.post('/connections/:ReceiverId/send', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.post_connections_send,
    // @ts-ignore
    asyncHandler(PostConnectionSend));

router.patch('/connections/:SenderId/accept', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.patch_connections_accept,
    // @ts-ignore
    asyncHandler(PostConnectionAccept));

router.delete('/connections/:SenderId/reject', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_connections_reject,
    // @ts-ignore
    asyncHandler(DeleteConnectionReject));

router.delete('/connections/:ReceiverId/cancel', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_connections_cancel,
    // @ts-ignore
    asyncHandler(DeleteConnectionCancel));


router.delete('/connections/:UserId', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_connections,
    // @ts-ignore
    asyncHandler(DeleteConnection));


export default router;