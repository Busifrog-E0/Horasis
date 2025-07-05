const UserInsightsData = {
    "Users": {
        "TotalCount": 14,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1720745781000,
                "Count": 1
            },
            {
                "Date": 1724844981000,
                "Count": 14
            }
        ]
    },
    "ActiveUsers": {
        "CountWithDate": [
            {
                "Date": 1720703400000,
                "Count": 0
            },
            {
                "Date": 1724869800000,
                "Count": 3
            }
        ],
        "TotalCount": 3,
        "PercentageChange": 0
    },
    "Activities": {
        "TotalCount": 82,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1721916981000,
                "Count": 44
            },
            {
                "Date": 1724844981000,
                "Count": 82
            }
        ]
    }
}

const UserBreakdownData = {
    "Country": [
        {
            "_id": "USA",
            "EntityName": "USA",
            "Count": 3,
            "DocId": "USA",
            "NextId": "undefined--USA"
        },
        {
            "_id": "India",
            "EntityName": "India",
            "Count": 7,
            "DocId": "India",
            "NextId": "undefined--India"
        }
    ],
    "City": [
        {
            "_id": "New York City",
            "EntityName": "New York City",
            "Count": 1,
            "DocId": "New York City",
            "NextId": "undefined--New York City"
        },
        {
            "_id": "Delhi",
            "EntityName": "Delhi",
            "Count": 1,
            "DocId": "Delhi",
            "NextId": "undefined--Delhi"
        }
    ],
    "Industry": [
        {
            "_id": "IT",
            "EntityName": "IT",
            "Count": 4,
            "DocId": "IT",
            "NextId": "undefined--IT"
        },
        {
            "_id": "Healthcare",
            "EntityName": "Healthcare",
            "Count": 1,
            "DocId": "Healthcare",
            "NextId": "undefined--Healthcare"
        }
    ],
    "JobTitle": [
        {
            "_id": "Software Developer",
            "EntityName": "Software Developer",
            "Count": 1,
            "DocId": "Software Developer",
            "NextId": "undefined--Software Developer"
        },
        {
            "_id": "Developer",
            "EntityName": "Developer",
            "Count": 3,
            "DocId": "Developer",
            "NextId": "undefined--Developer"
        }
    ]
}

const UserStatisticsData = 
    {
    "EventLocations": [
        {
            "_id": "USA",
            "EntityName": "USA",
            "Count": 3,
            "DocId": "USA",
            "NextId": "undefined--USA"
        },
        {
            "_id": "India",
            "EntityName": "India",
            "Count": 1,
            "DocId": "India",
            "NextId": "undefined--India"
        }
    ],
        "NonActiveUsersPercentage": 100,
            "ActiveUsersPercentage": 0
}

const AnalyticsDiscussionData = {
    "Discussions": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    },
    "Activities": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    }
}

const AnalyticsEventsData = {
    "Events": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1722794400,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724133600,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    },
    "VirtualEvents": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1722794400,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724133600,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    },
    "PhysicalEvents": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1722794400,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724133600,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    }
}

const AnalyticsArticlesData = {
    "Articles": {
        "TotalCount": 0,
        "PercentageChange": 0,
        "CountWithDate": [
            {
                "Date": 1722124800,
                "Count": 0
            },
            {
                "Date": 1722794400,
                "Count": 0
            },
            {
                "Date": 1723464000,
                "Count": 0
            },
            {
                "Date": 1724133600,
                "Count": 0
            },
            {
                "Date": 1724803200,
                "Count": 0
            }
        ]
    },
    "Engagements": {
        "TotalCount": 0,
        "PercentageChange": 0
    }
}


export default {
    AnalyticsArticlesData,
    AnalyticsDiscussionData,
    AnalyticsEventsData,
    UserBreakdownData,
    UserInsightsData,
    UserStatisticsData
}
