import usersDefinitions from "./usersDefinitions.js"
import membersDefinitions from "./membersDefinitions.js"


const AgendaData = {
    "Name": "Opening Ceremony",
    "Description": "The event will kick off with a grand opening ceremony.",
    "Date": 1724214719066,
    "StartTime": 1724214719066,
    "EndTime": 1724214719066
}

const PostEventsData = {
    "OrganiserId": "organiser_12345",
    "EventName": "Tech Innovations 2024",
    "Description": "A premier event showcasing the latest in technology and innovation.",
    "Date": 1724214719066,
    "StartTime": 1724214719066,
    "EndTime": 1724214719066,
    "Agenda": [AgendaData],
    "Privacy": "Public",
    "Type": "Offline",
    "Country": "USA",
    "DisplayPicture": "https://example.com/event_display_pic.jpg",
    "CoverPicture": "https://example.com/event_cover_pic.jpg",
    "HasDiscussion": true
}

const PatchEventsCoverData = {
    CoverPicture: "https://example.com/images/cover.jpg"
}

const EventsData = {
    "OrganiserId": "org123",
    "EventName": "Tech Innovations 2024",
    "Description": "A conference showcasing the latest in technology and innovation.",
    "Date": "2024-09-15",
    "StartTime": "09:00",
    "EndTime": "18:00",
    "Agenda": [
        {
            "Name": "Opening Keynote",
            "Description": "An overview of the latest trends in technology.",
            "Date": "2024-09-15",
            "StartTime": "09:00",
            "EndTime": "10:00"
        }
    ],
    "Privacy": "Public",
    "Type": "Physical",
    "Country": "United States",
    "NoOfMembers": 250,
    "DisplayPicture": "https://example.com/display-pic.jpg",
    "CoverPicture": "https://example.com/cover-pic.jpg",
    "HasDiscussion": true,
    "Speakers": [
        {
            "SpeakerId": "spk001",
            "UserDetails": usersDefinitions.UserData
        },
    ],
    "DocId": "evt12345",
    "CreatedIndex": 1,
    "MemberPermissions": membersDefinitions.PermissionData,
    "Languages": {
        "English": {
            "Description": "description"
        }
    },
    "Permissions": membersDefinitions.PermissionData
};

const EventDataArray = [EventsData];



export default {
    PostEventsData,
    PatchEventsCoverData,
    EventsData, EventDataArray,

}