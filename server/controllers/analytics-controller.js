import moment from 'moment';
import e from 'express';
import dataHandling from '../databaseControllers/functions.js'
import { CountUsers } from '../databaseControllers/users-databaseController.js';
import { CommentCount } from '../databaseControllers/comments-databaseController.js';
import { CountLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadEvents } from '../databaseControllers/events-databaseController.js';
import { CountActiveUsers, } from '../databaseControllers/activeUsers-databaseController.js';
import { ReadDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { AggregateArticles, } from '../databaseControllers/articles-databaseController.js';
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
    const { Country } = req.query;
    const CountryFilter = Country ? { Country } : {}
    const [TotalUsers, CountryData, City, Industry, JobTitle, CountryUsers] = await Promise.all([
        CountUsers({}),
        GetDocumentCountByFields("Users", "Country"),
        GetDocumentCountByFields("Users", "City"),
        GetDocumentCountByFields("Users", "Industry", CountryFilter),
        GetDocumentCountByFields("Users", "JobTitle", CountryFilter),
        CountUsers(CountryFilter)
    ])
    const FilteredUsers = Country ? CountryUsers : TotalUsers
    const UserCountryPercentage = CountryData.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, TotalUsers) });
    const UserCityPercentage = City.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, TotalUsers) });
    const UserIndustryPercentage = Industry.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, CountryUsers) });
    const UserJobTitlePercentage = JobTitle.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, CountryUsers) });
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
 * @param {"Activities"|"Events"|"Discussions"|"Articles"|"Users"|"Likes"|"Comments"} collectionName 
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
    let data = await dataHandling.Aggregate(collectionName, pipeline, undefined, Limit, { Count: -1 });
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetEngagementBreakdown = async (req, res) => {
    //@ts-ignore
    const { Type, Country } = req.query.Filter;
    const LikeWhere = { ParentType: Type }
    const CommentWhere = { RootParentType: Type }
    const CountryFilter = Country ? { Country } : {}
    const [TotalLikes, TotalComments, LikeCountryData, LikeCityData, LikeIndustryData,
        LikeJobTitleData, CommentCountryData, CommentCityData, CommentIndustryData, CommentJobTitleData, CountryLikes, CountryComments] = await Promise.all([
            CountLikes(LikeWhere),
            CommentCount(CommentWhere),
            GetDocumentCountByFields("Likes", "UserDetails.Country", LikeWhere,  -1),
            GetDocumentCountByFields("Likes", "UserDetails.City", LikeWhere,  -1),
            GetDocumentCountByFields("Likes", "UserDetails.Industry", { ...CountryFilter, ...LikeWhere },  -1),
            GetDocumentCountByFields("Likes", "UserDetails.JobTitle", { ...CountryFilter, ...LikeWhere },  -1),
            GetDocumentCountByFields("Comments", "UserDetails.Country", CommentWhere,  -1),
            GetDocumentCountByFields("Comments", "UserDetails.City", CommentWhere,  -1),
            GetDocumentCountByFields("Comments", "UserDetails.Industry", { ...CountryFilter, ...CommentWhere },  -1),
            GetDocumentCountByFields("Comments", "UserDetails.JobTitle", { ...CountryFilter, ...CommentWhere },  -1),
            CountLikes({ ...CountryFilter, ...LikeWhere }),
            CommentCount({ ...CountryFilter, ...CommentWhere }),
        ])
    const CountryData = MergeTwoArrayCount(LikeCountryData, CommentCountryData);
    const City = MergeTwoArrayCount(LikeCityData, CommentCityData);
    const Industry = MergeTwoArrayCount(LikeIndustryData, CommentIndustryData);
    const JobTitle = MergeTwoArrayCount(LikeJobTitleData, CommentJobTitleData);

    const FilteredCount = Country ? CountryLikes + CountryComments : TotalComments + TotalLikes;
    const CountryPercentage = CountryData.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, FilteredCount) });
    const CityPercentage = City.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, FilteredCount) });
    const IndustryPercentage = Industry.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, FilteredCount) });
    const JobTitlePercentage = JobTitle.map(item => item.Count === 0 ? item : { ...item, Count: GetPercentageOfData(item.Count, FilteredCount) });

    return res.json({ Country: CountryPercentage, City: CityPercentage, Industry: IndustryPercentage, JobTitle: JobTitlePercentage })
}


const MergeTwoArrayCount = (data1, data2, Limit = 6) => {
    const combinedResults = [...data1];

    // Loop through data2 and add counts to combinedResults
    data2.forEach(item2 => {
        // Check if the EntityName already exists in combinedResults
        const existingItem = combinedResults.find(item1 => item1.EntityName === item2.EntityName);

        if (existingItem) {
            // If it exists, add the counts
            existingItem.Count += item2.Count;
        } else {
            // If it doesn't exist, add it as a new entry
            combinedResults.push(item2);
        }
    });

    // Sort by count in descending order and limit the size to the specified limit
    return combinedResults
        .sort((a, b) => b.Count - a.Count)
        .slice(0, Limit);
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
    GetEventsAnalytics,
    GetEngagementBreakdown

}


