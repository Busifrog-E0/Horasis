import {
    GetConversations,
    GetOneFromConversations,
    GetMessages,
} from '../controllers/chat-controller.js';
import asyncHandler from 'express-async-handler';
import SwaggerDocs from '../swaggerDocs/chat-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();

router.get('/chat', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,SwaggerDocs.get_Chat,
    //@ts-ignore
asyncHandler(GetConversations));

router.get('/chat/:ConversationId', decodeIDToken, ensureAuthorized("User"),SwaggerDocs.get_Chat_ConversationId,
    // @ts-ignore
    asyncHandler(GetOneFromConversations));

router.get('/chat/:ConversationId/messages', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Chat_ConversationId_Messages,
    // @ts-ignore
    asyncHandler(GetMessages));


export default router;