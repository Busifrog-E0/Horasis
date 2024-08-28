import {
    GetAnalyticsTopArticles,
    GetAnalyticsTopDiscussions,
    GetAnalyticsTopEvents,
    GetArticleAnalytics,
    GetDiscussionAnalytics,
    GetEventsAnalytics,
    GetUserBreakdown,
    GetUserInsightsAnalytics,
    GetUserStatistics,
} from '../controllers/analytics-controller.js';
import asyncHandler from 'express-async-handler';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
// import { ValidatePostAnalytics, ValidateGetAnalytics, ValidatePatchAnalytics } from '../validations/analytics-validations.js';

import e from 'express';
import { decode } from 'jsonwebtoken';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidateGetIntervalAnalytics } from '../validations/analytics-validations.js';
const router = e.Router();
router.route

router.get('/analytics/userInsights', decodeIDToken, ensureAuthorized("User"), ValidateGetIntervalAnalytics,
    //@ts-ignore
    asyncHandler(GetUserInsightsAnalytics));

router.get('/analytics/userBreakdown', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetUserBreakdown));

router.get('/analytics/userStatistics', decodeIDToken, ensureAuthorized("User"), ValidateGetIntervalAnalytics,
    // @ts-ignore
    asyncHandler(GetUserStatistics));

router.get('/analytics/articles', decodeIDToken, ensureAuthorized("User"), ValidateGetIntervalAnalytics,
    // @ts-ignore
    asyncHandler(GetArticleAnalytics))

router.get('/analytics/events', decodeIDToken, ensureAuthorized("User"), ValidateGetIntervalAnalytics,
    // @ts-ignore
    asyncHandler(GetEventsAnalytics))

router.get('/analytics/discussions', decodeIDToken, ensureAuthorized("User"), ValidateGetIntervalAnalytics,
    // @ts-ignore
    asyncHandler(GetDiscussionAnalytics))

router.get('/analytics/topArticles', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopArticles))

router.get('/analytics/topEvents', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopEvents))

router.get('/analytics/topDiscussions', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopDiscussions))

export default router;