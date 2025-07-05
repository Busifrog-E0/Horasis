const get_Analytics_UserInsights = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/UserInsightsData' }
         } */
    next();
}

const get_Analytics_UserBreakdown = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/UserBreakdownData' }
         } */
    next();
}

const get_Analytics_UserStatistics = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/UserStatisticsData' }
         } */
    next();
}
 
const get_Analytics_Articles = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/AnalyticsArticlesData' }
         } */
    next();
}

const get_Analytics_Events = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/AnalyticsEventsData' }
         } */
    next();
}

const get_Analytics_Discussions = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/AnalyticsDiscussionData' }
         } */
    next();
}

const get_Analytics_TopArticles = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/ArticleDataArray' }
         } */
    next();
}

const get_Analytics_TopEvents = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/EventDataArray' }
         } */
    next();
}

const get_Analytics_TopDiscussions = (req, res, next) => {
    /* #swagger.security = [{ "BearerAuth": [] }] */
    /* #swagger.tags = ['Analytics'] */
    /* #swagger.responses[200] = {
                 description: 'Article Data',
                 schema: { $ref: '#/definitions/DiscussionDataArray' }
         } */
    next();
}



export default {
    get_Analytics_UserInsights,
    get_Analytics_UserBreakdown,
    get_Analytics_UserStatistics,
    get_Analytics_Articles,
    get_Analytics_Events,
    get_Analytics_Discussions,
    get_Analytics_TopArticles,
    get_Analytics_TopEvents,
    get_Analytics_TopDiscussions
}