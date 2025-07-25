import {
    GetOneFromReports, GetReports, PostReports, PatchReports, DeleteReports,
} from '../controllers/reports-controller.js';
import asyncHandler from 'express-async-handler';

import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePostReports, ValidateGetReports, ValidatePatchReports } from '../validations/reports-validations.js';
import SwaggerDocs from '../swaggerDocs/reports-swaggerDocs.js'

import e from 'express';
import { ReportMarkAsReadMiddleware } from '../middleware/reports-middleware.js';
import { QueryParameterFormatting } from '../middleware/common.js';
const router = e.Router();
router.route

router.get('/reports', decodeIDToken, ensureAuthorized("Admin","SuperAdmin"), ValidateGetReports,QueryParameterFormatting, SwaggerDocs.get_Reports,
    // @ts-ignore
    asyncHandler(GetReports));

router.get('/reports/:ReportId', decodeIDToken, ensureAuthorized("Admin", "SuperAdmin"), SwaggerDocs.get_Reports_ReportId,
    // @ts-ignore
    asyncHandler(GetOneFromReports));

router.post('/reports', decodeIDToken, ensureAuthorized("User","Admin"), ValidatePostReports, SwaggerDocs.post_Reports,
    // @ts-ignore
    asyncHandler(PostReports));

router.patch('/reports/:ReportId/markAsRead', decodeIDToken, ensureAuthorized("Admin", "SuperAdmin"), ReportMarkAsReadMiddleware, SwaggerDocs.patch_Reports_ReportId,
    // @ts-ignore
    asyncHandler(PatchReports));

router.delete('/reports/:ReportId/entity', decodeIDToken, ensureAuthorized("Admin", "SuperAdmin"), SwaggerDocs.delete_Reports_ReportId,
    // @ts-ignore
    asyncHandler(DeleteReports));

export default router;