import moment from 'moment';
import e from 'express';
import dataHandling from '../databaseControllers/functions.js'
import { AggregateUsers, CountUsers } from '../databaseControllers/users-databaseController.js';
import { CountActivities, ReadActivities } from '../databaseControllers/activities-databaseController.js';
import { CommentCount } from '../databaseControllers/comments-databaseController.js';
import { CountLikes } from '../databaseControllers/likes-databaseController.js';
import { CountEvents, ReadEvents } from '../databaseControllers/events-databaseController.js';
import { CountActiveUsers, ReadActiveUsers } from '../databaseControllers/activeUsers-databaseController.js';
import { AggregateDiscussions, ReadDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AggregateArticles, CountArticles } from '../databaseControllers/articles-databaseController.js';

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserInsightsAnalytics = async (req, res) => {
    const { startDate, endDate, noOfIntervals } = req.query
    const [Users, ActiveUsers, Activities] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Users", {}, startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetActiveUsersWithinAnInterval(startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Activities", { Type: "Feed" }, startDate, endDate, noOfIntervals),
    ])
    return res.json({ Users, ActiveUsers, Activities })
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserBreakdown = (async (req, res) => {
    const [Country, City, Industry, JobTitle] = await Promise.all([
        GetDocumentCountByFields("Users", "Country"),
        GetDocumentCountByFields("Users", "City"),
        GetDocumentCountByFields("Users", "Industry"),
        GetDocumentCountByFields("Users", "JobTitle"),
    ])
    return res.json({ Country, City, Industry, JobTitle })
})

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserStatistics = async (req, res) => {
    const { startDate, endDate, noOfIntervals } = req.query
    const [EventLocations, UsersCount, ActiveUsers] = await Promise.all([
        GetDocumentCountByFields("Events", "Country", {}, -1),
        CountUsers({}),
        //@ts-ignore
        GetActiveUsersWithinAnInterval(startDate, endDate, noOfIntervals)
    ])
    const ActiveUsersCount = ActiveUsers.TotalCount;
    const NonActiveUsersPercentage = parseInt((((UsersCount - ActiveUsersCount) / UsersCount) * 100).toFixed(2));
    const ActiveUsersPercentage = parseInt(((ActiveUsersCount / UsersCount) * 100).toFixed(2));
    return res.json({ EventLocations, NonActiveUsersPercentage, ActiveUsersPercentage })
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetArticleAnalytics = async (req, res) => {
    const { startDate, endDate, noOfIntervals } = req.query
    const [Articles, Engagements] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Articles", {}, startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetArticleEngagementCount(startDate, endDate)
    ])
    return res.json({ Articles, Engagements })
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetDiscussionAnalytics = async (req, res) => {
    const { startDate, endDate, noOfIntervals } = req.query
    const [Discussions, Activities] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Discussions", {}, startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Activities", { Type: "Discussion" }, startDate, endDate, noOfIntervals)
    ])
    return res.json({ Discussions, Activities })
}

/** 
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetEventsAnalytics = async (req, res) => {
    const { startDate, endDate, noOfIntervals } = req.query
    const [Events, VirtualEvents, PhysicalEvents] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", {}, startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", { Type: "Virtual" }, startDate, endDate, noOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", { Type: "Physical" }, startDate, endDate, noOfIntervals)
    ])
    return res.json({ Events, VirtualEvents, PhysicalEvents })
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetAnalyticsTopArticles = async (req, res) => {
    const { Limit, NextId, Keyword, OrderBy } = req.query;
    const pipeline = [
        {
            $addFields: { InteractionCount: { $sum: ["$NoOfComments", "$NoOfLikes"] } }
        }
    ]
    const data = await AggregateArticles(pipeline, NextId, Limit, { InteractionCount: "desc" })
    return res.json(data)
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetAnalyticsTopDiscussions = async (req, res) => {
    const { Filter, Limit, NextId, Keyword, OrderBy } = req.query;
    //@ts-ignore
    const data = await ReadDiscussions(Filter, NextId, Limit, { NoOfActivities: "desc" })
    return res.json(data)
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetAnalyticsTopEvents = async (req, res) => {
    const { Filter, Limit, NextId, Keyword, OrderBy } = req.query;
    //@ts-ignore
    const data = await ReadEvents(Filter, NextId, Limit, { NoOfActivities: "desc" })
    return res.json(data)
}


/**
 * 
 * @param {"Users"|"Activities"|"Articles"|"Events"|"Discussions"} collectionName 
 * @param {object} where 
 * 
 */
const GetAnalyticsWithinAnInterval = async (
    collectionName,
    where = {},
    startDate = moment().subtract(1, 'month').startOf('day').valueOf(),
    endDate = moment().startOf('day').valueOf(),
    noOfIntervals = 6
) => {
    const intervalSize = (endDate - startDate) / (noOfIntervals - 1);

    const intervals = [];
    for (let i = 0; i < noOfIntervals; i++) {
        intervals.push(moment(startDate + i * intervalSize).valueOf());
    }

    const CountWithDate = await Promise.all(intervals.map(async CreatedIndex => {
        const query = { ...where, CreatedIndex: { $lte: CreatedIndex } }
        const Count = await dataHandling.ReadCount(collectionName, query)
        return { Date: CreatedIndex, Count }
    }))
    const TotalCount = CountWithDate[noOfIntervals - 1].Count;
    const PercentageChange = CountWithDate[0].Count !== 0 ?
        parseInt((((TotalCount - CountWithDate[0].Count) / CountWithDate[0].Count) * 100).toFixed(2)) : 0;
    return { TotalCount, PercentageChange, CountWithDate }
};

/**
 * 
 * @param {"Activities"|"Events"|"Discussions"|"Articles"|"Users"} collectionName 
 * @param {string} fieldName 
 * @param {object} where 
 * @param {number} Limit 
 * @returns 
 */
const GetDocumentCountByFields = async (collectionName, fieldName, where = {}, Limit = 6) => {
    const pipeline = [
        {
            $match: where
        },
        {
            $group: {
                _id: `$${fieldName}`,
                ["EntityName"]: { $first: `$${fieldName}` },
                Count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]
    const data = await dataHandling.Aggregate(collectionName, pipeline, undefined, Limit, undefined);
    return data;
}


const GetActiveUsersWithinAnInterval = async (
    startDate = moment().subtract(1, 'month').startOf('day').valueOf(),
    endDate = moment().startOf('day').valueOf(),
    noOfIntervals = 6
) => {
    startDate = moment(startDate).startOf('day').valueOf();
    endDate = moment(endDate).startOf('day').add(1, 'day').valueOf();
    const intervalSize = (endDate - startDate) / (noOfIntervals - 1);
    const intervals = [];
    for (let i = 0; i < noOfIntervals - 1; i++) {
        intervals.push({
            Date: {
                $gte: startDate + i * intervalSize,
                $lt: startDate + (i + 1) * intervalSize
            }
        });
    }
    intervals.unshift({
        Date: {
            $gte: startDate - 1 * intervalSize,
            $lt: startDate
        }
    })
    const data = await Promise.all(intervals.map(async interval => {
        const UserIds = await CountActiveUsers(interval);
        return { Date: interval.Date.$lt, Count: UserIds.length }
    }));
    const TotalCount = data[data.length - 1].Count;
    const PercentageChange = data[0].Count !== 0 ?
        parseInt((((TotalCount - data[0].Count) / data[0].Count) * 100).toFixed(2)) : 0;
    return { CountWithDate: data, TotalCount, PercentageChange };
}

/**
 * 
 * @param {number} startDate 
 * @param {number} endDate 
 * @returns 
 */
const GetArticleEngagementCount = async (startDate, endDate) => {
    const [NoOfCommentsAtStart, NoOfLikesAtStart, NoOfComments, NoOfLikes] = await Promise.all([
        CommentCount({ ParentType: "Article", CreatedIndex: { $gte: startDate, $lt: endDate } }),
        CountLikes({ Type: "Article", CreatedIndex: { $gte: startDate, $lt: endDate } }),
        CommentCount({ ParentType: "Article", CreatedIndex: { $lt: endDate } }),
        CountLikes({ Type: "Article", CreatedIndex: { $lt: endDate } }),
    ])
    const EngagementCountAtStart = NoOfLikesAtStart + NoOfCommentsAtStart;
    const EngagementCount = NoOfComments + NoOfLikes;
    const TotalCount = EngagementCount;
    const PercentageChange = EngagementCountAtStart !== 0 ?
        parseInt((((EngagementCount - EngagementCountAtStart) / EngagementCountAtStart) * 100).toFixed(2)) : 0;
    return { TotalCount, PercentageChange };
}



export {
    GetUserInsightsAnalytics,
    GetAnalyticsWithinAnInterval,
    GetUserBreakdown,
    GetUserStatistics,
    GetArticleAnalytics,
    GetAnalyticsTopArticles,
    GetAnalyticsTopDiscussions,
    GetAnalyticsTopEvents,
    GetDiscussionAnalytics,
    GetEventsAnalytics

}


