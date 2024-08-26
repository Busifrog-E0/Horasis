import {
    GetUserBreakdown,
    GetUserInsightsAnalytics,
    GetUserStatistics,
} from '../controllers/analytics-controller.js';
import asyncHandler from 'express-async-handler';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostAnalytics, ValidateGetAnalytics, ValidatePatchAnalytics } from '../validations/analytics-validations.js';

import e from 'express';
const router = e.Router();
router.route

router.get('/analytics/userInsights', decodeIDToken, ensureAuthorized("User"), asyncHandler(GetUserInsightsAnalytics));

router.get('/analytics/userBreakdown',decodeIDToken,ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetUserBreakdown));

router.get('/analytics/userStatistics',decodeIDToken,ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetUserStatistics));
/*
router.get('/analytics/articles',
    // @ts-ignore
    asyncHandler(PatchAnalytics));

router.get('/analytics/discussions',
    // @ts-ignore
    asyncHandler(DeleteAnalytics));

router.get('/analytics/engagements',)
*/
export default router;