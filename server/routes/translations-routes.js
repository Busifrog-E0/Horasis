import {
    TranslateData
} from '../controllers/translations-controller.js';
import asyncHandler from 'express-async-handler';

// import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostTranslations, ValidateGetTranslations, ValidatePatchTranslations } from '../validations/translations-controller.js-validations.js';
import SwaggerDocs from '../swaggerDocs/translations-swaggerDocs.js';
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateTranslation } from '../validations/translations-validations.js';
const router = e.Router();
router.route

router.post('/translate', decodeIDToken, ensureAuthorized("User"), ValidateTranslation,
    SwaggerDocs.post_Translations,
    //@ts-ignore
    asyncHandler(TranslateData));


export default router;