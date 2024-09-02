import moment from 'moment';
//eslint-disable-next-line
import e from 'express';
import dataHandling from '../databaseControllers/functions.js'
import {  CountUsers } from '../databaseControllers/users-databaseController.js';
import { CommentCount } from '../databaseControllers/comments-databaseController.js';
import { CountLikes } from '../databaseControllers/likes-databaseController.js';
import {  ReadEvents } from '../databaseControllers/events-databaseController.js';
import { CountActiveUsers,  } from '../databaseControllers/activeUsers-databaseController.js';
import {  ReadDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AggregateArticles,  } from '../databaseControllers/articles-databaseController.js';
import { GetPercentageOfData } from './common.js';

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserInsightsAnalytics = async (req, res) => {
    const { Index, NoOfIntervals } = req.query
    const [Users, ActiveUsers, Activities] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Users", {}, Index, NoOfIntervals),
        //@ts-ignore
        GetActiveUsersWithinAnInterval(Index, NoOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Activities", { Type: "Feed" }, Index, NoOfIntervals),
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
    const [TotalUsers, Country, City, Industry, JobTitle] = await Promise.all([
        CountUsers({}),
        GetDocumentCountByFields("Users", "Country"),
        GetDocumentCountByFields("Users", "City"),
        GetDocumentCountByFields("Users", "Industry"),
        GetDocumentCountByFields("Users", "JobTitle"),
    ])
    const UserCountryPercentage = Country.map(item => { item.Count === 0 ? 0 : GetPercentageOfData(item.Count, TotalUsers); return item; });
    const UserCityPercentage = City.map(item => { item.Count === 0 ? 0 : GetPercentageOfData(item.Count, TotalUsers); return item; });
    const UserIndustryPercentage = Industry.map(item => { item.Count === 0 ? 0 : GetPercentageOfData(item.Count, TotalUsers); return item; });
    const UserJobTitlePercentage = JobTitle.map(item => { item.Count ===0 ? 0 : GetPercentageOfData(item.Count, TotalUsers); return item; });
    return res.json({ Country: UserCountryPercentage, City: UserCityPercentage, Industry: UserIndustryPercentage, JobTitle: UserJobTitlePercentage })
})

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserStatistics = async (req, res) => {
    const { Index, NoOfIntervals } = req.query
    const [EventLocations, UsersCount, ActiveUsers] = await Promise.all([
        GetDocumentCountByFields("Events", "Country", { StartTime: { $gte: moment().startOf('day').valueOf(), $lte: moment().endOf('day').valueOf() } }, -1),
        CountUsers({}),
        //@ts-ignore
        GetActiveUsersWithinAnInterval(Index, NoOfIntervals)
    ])
    const ActiveUsersCount = ActiveUsers.TotalCount;
    const NonActiveUsersPercentage = GetPercentageOfData(UsersCount - ActiveUsersCount, UsersCount);
    const ActiveUsersPercentage = GetPercentageOfData(ActiveUsersCount, UsersCount);
    return res.json({ EventLocations, NonActiveUsersPercentage, ActiveUsersPercentage })
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetArticleAnalytics = async (req, res) => {
    const { Index, NoOfIntervals } = req.query
    const [Articles, Engagements] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Articles", {}, Index, NoOfIntervals),
        //@ts-ignore
        GetArticleEngagementCount(Index.$gte, Index.$lte)
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
    const { Index, NoOfIntervals } = req.query
    const [Discussions, Activities] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Discussions", {}, Index, NoOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Activities", { Type: "Discussion" }, Index, NoOfIntervals)
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
    const { Index, NoOfIntervals } = req.query
    const [Events, VirtualEvents, PhysicalEvents] = await Promise.all([
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", {}, Index, NoOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", { Type: "Virtual" }, Index, NoOfIntervals),
        //@ts-ignore
        GetAnalyticsWithinAnInterval("Events", { Type: "Physical" }, Index, NoOfIntervals)
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
    const data = await ReadEvents(Filter, NextId, Limit, { NoOfMembers: "desc" })
    return res.json(data)
}


/**
 * 
 * @param {"Users"|"Activities"|"Articles"|"Events"|"Discussions"} collectionName 
 * @param {object} where 
 * @param {{$lte: number, $gte: number}} Index
 * 
 */
const GetAnalyticsWithinAnInterval = async (
    collectionName,
    where = {},
    Index,
    NoOfIntervals = 6
) => {
    const intervalSize = (Index.$lte - Index.$gte) / (NoOfIntervals - 1);

    const intervals = [];
    for (let i = 0; i < NoOfIntervals; i++) {
        intervals.push(moment(Index.$gte + i * intervalSize).valueOf());
    }

    const CountWithDate = await Promise.all(intervals.map(async CreatedIndex => {
        const query = { ...where, CreatedIndex: { $lte: CreatedIndex } }
        const Count = await dataHandling.ReadCount(collectionName, query)
        return { Date: CreatedIndex, Count }
    }))
    const TotalCount = CountWithDate[NoOfIntervals - 1].Count;
    const PercentageChange = CountWithDate[0].Count !== 0 ?
        GetPercentageOfData(TotalCount - CountWithDate[0].Count, CountWithDate[0].Count) : 0;
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
    ]
    const data = await dataHandling.Aggregate(collectionName, pipeline, undefined, Limit, {Count : -1});
    return data;
}

/**
 * 
 * @param {{$lte: number, $gte: number}} Index 
 * @param {number} NoOfIntervals 
 * @returns 
 */
const GetActiveUsersWithinAnInterval = async (
    Index,
    NoOfIntervals = 6
) => {
    Index.$gte = moment(Index.$gte).startOf('day').valueOf();
    Index.$lte = moment(Index.$lte).startOf('day').add(1, 'day').valueOf();
    const intervalSize = (Index.$lte - Index.$gte) / (NoOfIntervals - 1);
    const intervals = [];
    for (let i = 0; i < NoOfIntervals - 1; i++) {
        intervals.push({
            Date: {
                $gte: Index.$gte + i * intervalSize,
                $lt: Index.$gte + (i + 1) * intervalSize
            }
        });
    }
    intervals.unshift({
        Date: {
            $gte: Index.$gte - 1 * intervalSize,
            $lt: Index.$gte
        }
    })
    const data = await Promise.all(intervals.map(async interval => {
        const UserIds = await CountActiveUsers(interval);
        return { Date: interval.Date.$lt, Count: UserIds.length }
    }));
    const TotalCount = data[data.length - 1].Count;
    const PercentageChange = data[0].Count !== 0 ?
        GetPercentageOfData(TotalCount - data[0].Count, data[0].Count) : 0;
    return { CountWithDate: data, TotalCount, PercentageChange };
}

/**
 * 
 * @param {number} StartDate 
 * @param {number} EndDate 
 * @returns 
 */
const GetArticleEngagementCount = async (StartDate, EndDate) => {
    const [NoOfCommentsAtStart, NoOfLikesAtStart, NoOfComments, NoOfLikes] = await Promise.all([
        CommentCount({ ParentType: "Article", CreatedIndex: { $gte: StartDate, $lt: EndDate } }),
        CountLikes({ Type: "Article", CreatedIndex: { $gte: StartDate, $lt: EndDate } }),
        CommentCount({ ParentType: "Article", CreatedIndex: { $lt: EndDate } }),
        CountLikes({ Type: "Article", CreatedIndex: { $lt: EndDate } }),
    ])
    const EngagementCountAtStart = NoOfLikesAtStart + NoOfCommentsAtStart;
    const EngagementCount = NoOfComments + NoOfLikes;
    const TotalCount = EngagementCount;
    const PercentageChange = EngagementCountAtStart !== 0 ?
        GetPercentageOfData(EngagementCount - EngagementCountAtStart, EngagementCountAtStart) : 0;
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


