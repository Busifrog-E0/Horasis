import {
    GetConversations, GetMessages, ReterieveConversationId,
} from '../controllers/chats-controller.js';
import asyncHandler from 'express-async-handler';
import SwaggerDocs from '../swaggerDocs/chat-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { PostReterieveConversationId } from '../validations/chat-validations.js';
const router = e.Router();

router.get('/chats', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Chat,
    //@ts-ignore
asyncHandler(GetConversations));

router.get('/chats/:ConversationId/messages', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Chat_ConversationId_Messages,
    // @ts-ignore
    asyncHandler(GetMessages));


router.post('/reterieveConversationId', decodeIDToken, ensureAuthorized("User"), PostReterieveConversationId,
    SwaggerDocs.post_ReterieveConversationId,
    // @ts-ignore
    asyncHandler(ReterieveConversationId));



export default router;