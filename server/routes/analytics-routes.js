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
import SwaggerDocs from '../swaggerDocs/analytics-swaggerDocs.js'
import e from 'express';
import { decode } from 'jsonwebtoken';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { ValidateGetIntervalAnalytics, ValidateGetUserBreakdownAnalytics } from '../validations/analytics-validations.js';
const router = e.Router();
router.route

router.get('/analytics/userInsights', decodeIDToken, ensureAuthorized("Admin"), ValidateGetIntervalAnalytics,
    SwaggerDocs.get_Analytics_UserInsights,
    //@ts-ignore
    asyncHandler(GetUserInsightsAnalytics));

router.get('/analytics/userBreakdown', decodeIDToken, ensureAuthorized("Admin"), ValidateGetUserBreakdownAnalytics,
    SwaggerDocs.get_Analytics_UserBreakdown,
    // @ts-ignore
    asyncHandler(GetUserBreakdown));

router.get('/analytics/userStatistics', decodeIDToken, ensureAuthorized("Admin"), ValidateGetIntervalAnalytics,
    SwaggerDocs.get_Analytics_UserStatistics,
    // @ts-ignore
    asyncHandler(GetUserStatistics));

router.get('/analytics/articles', decodeIDToken, ensureAuthorized("Admin"), ValidateGetIntervalAnalytics,
    SwaggerDocs.get_Analytics_Articles,
    // @ts-ignore
    asyncHandler(GetArticleAnalytics))

router.get('/analytics/events', decodeIDToken, ensureAuthorized("Admin"), ValidateGetIntervalAnalytics,
    SwaggerDocs.get_Analytics_Events,
    // @ts-ignore
    asyncHandler(GetEventsAnalytics))

router.get('/analytics/discussions', decodeIDToken, ensureAuthorized("Admin"), ValidateGetIntervalAnalytics,
    SwaggerDocs.get_Analytics_Discussions,
    // @ts-ignore
    asyncHandler(GetDiscussionAnalytics))

router.get('/analytics/topArticles', decodeIDToken, ensureAuthorized("Admin"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Analytics_TopArticles,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopArticles))

router.get('/analytics/topEvents', decodeIDToken, ensureAuthorized("Admin"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Analytics_TopEvents,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopEvents))

router.get('/analytics/topDiscussions', decodeIDToken, ensureAuthorized("Admin"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Analytics_TopDiscussions,
    // @ts-ignore
    asyncHandler(GetAnalyticsTopDiscussions))

export default router;