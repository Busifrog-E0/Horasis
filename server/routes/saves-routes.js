import {
    GetSaves, PostSaves, DeleteSaves,
} from '../controllers/saves-controller.js';
import asyncHandler from 'express-async-handler';

// import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostSaves, ValidateGetSaves, ValidatePatchSaves } from '../validations/saves-validations.js';
import SwaggerDocs from '../swaggerDocs/saves-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateGetSaves, ValidatePostSaves } from '../validations/saves-validations.js';
import { QueryParameterFormatting } from '../middleware/common.js';
const router = e.Router();
router.route

router.get('/saves', decodeIDToken, ensureAuthorized("User"), ValidateGetSaves, QueryParameterFormatting,
    // @ts-ignore
    asyncHandler(GetSaves));

router.post('/saves', decodeIDToken, ensureAuthorized("User"), ValidatePostSaves,SwaggerDocs.post_Saves,
    // @ts-ignore
    asyncHandler(PostSaves));

router.delete('/saves/:EntityId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteSaves));

export default router;