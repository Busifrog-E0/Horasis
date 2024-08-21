import usersDefinitions from "./usersDefinitions.js"


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
    "Date": "2024-09-01",
    "StartTime": "09:00 AM",
    "EndTime": "04:00 PM",
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
    EventName: "Example Event",
    Brief: "This is a brief description of the discussion",
    OrganiserId: "1234567890",
    UserDetails: usersDefinitions.UserData,
    Description: "This is a detailed description of the discussion",
    DocId: "abcdef1234567890",
    Privacy: "Public",
    CreatedIndex: 1234567890,
    CoverPicture: "https://example.com/images/cover.jpg",
    NoOfMembers: 10,
    isMember: true,
    MembershipStatus: "Accepted",
};

const EventDataArray = [EventsData];



export default {
    PostEventsData,
    PatchEventsCoverData,
    EventsData, EventDataArray,

}