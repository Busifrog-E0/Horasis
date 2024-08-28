import moment from 'moment';
import dataHandling from '../databaseControllers/functions.js'
import { AggregateUsers, CountUsers } from '../databaseControllers/users-databaseController.js';
import { CountActivities, ReadActivities } from '../databaseControllers/activities-databaseController.js';
import { CommentCount } from '../databaseControllers/comments-databaseController.js';
import { CountLikes } from '../databaseControllers/likes-databaseController.js';
import { CountEvents } from '../databaseControllers/events-databaseController.js';
import { CountActiveUsers, ReadActiveUsers } from '../databaseControllers/activeUsers-databaseController.js';

const GetUserInsightsAnalytics = async (req, res) => {
    const [Users, ActiveUsers, Posts] = await Promise.all([
        GetAnalyticsWithinAnInterval("Users"),
        GetActiveUsersWithinAnInterval(),
        GetAnalyticsWithinAnInterval("Activities", { Type: "Feed" })
    ])
    return res.json({ Users, ActiveUsers, Posts })
}

const GetUserBreakdown = (async (req, res) => {
    const [Country, City, Industry, JobTitle] = await Promise.all([
        GetDocumentCountByFields("Users", "Country"),
        GetDocumentCountByFields("Users", "City"),
        GetDocumentCountByFields("Users", "Industry"),
        GetDocumentCountByFields("Users", "JobTitle"),
    ])
    return res.json({ Country, City, Industry, JobTitle })
})

const GetUserStatistics = async (req, res) => {
    const [EventLocations, UsersCount, ActiveUsers] = await Promise.all([
        GetDocumentCountByFields("Events", "Country", {}, -1),
        CountUsers({}),
        GetActiveUsersWithinAnInterval()
    ])
    const ActiveUsersCount = ActiveUsers.TotalCount;
    const NonActiveUsersPercentage = ((ActiveUsersCount - UsersCount) / UsersCount) * 100;
    const ActiveUsersPercentage = (ActiveUsersCount / UsersCount) * 100;
    return res.json({ EventLocations, NonActiveUsersPercentage, ActiveUsersPercentage })
}

const GetArticleAnalytics = async (req, res) => {
    const [NoOfEvents, NoOfEngagements] = await Promise.all([
        CountEvents({}),
        GetEngagementCount("Article")
    ])
    return res.json({ NoOfEvents, NoOfEngagements })
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
        console.log(collectionName, CreatedIndex, Count)
        return { Date: CreatedIndex, Count }
    }))
    const TotalCount = CountWithDate[noOfIntervals - 1].Count;
    const PercentageChange = Number((((TotalCount - CountWithDate[0].Count) / CountWithDate[0].Count) * 100).toFixed(2));
    return { TotalCount, PercentageChange, CountWithDate }
};

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
    for (let i = 0; i < noOfIntervals; i++) {
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
        const UserIds = await CountActiveUsers({ interval });
        return { Date: interval.Date.$lt, Count: UserIds.length }
    }));
    const TotalCount = data[data.length - 1].Count;
    const PercentageChange = Number((((TotalCount - data[0].Count) / data[0].Count) * 100).toFixed(2));
    return { CountWithDate: data, TotalCount, PercentageChange };
}

/**
 * 
 * @param {"Discussion"|"Event"|"Article"} EntityType 
 */
const GetEngagementCount = async (EntityType) => {
    switch (EntityType) {
        case "Discussion":
            return await CountActivities({ Type: "Discussion" });
        case "Article":
            const [NoOfComments, NoOfLikes] = await Promise.all([
                CommentCount({ ParentType: "Article" }),
                CountLikes({ Type: "Article" })
            ])
            return NoOfComments + NoOfLikes;
        case "Event":
            return await CountActivities({ Type: "Event" });
    }
}

export {
    GetUserInsightsAnalytics,
    GetAnalyticsWithinAnInterval,
    GetUserBreakdown,
    GetUserStatistics,
    GetArticleAnalytics
}


