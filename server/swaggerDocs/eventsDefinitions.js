import usersDefinitions from "./usersDefinitions.js"

const PostEventsData = {
    EventName: 'John Doe',
    Brief: 'This is a brief',
    Organiserīd: 'user1234',
    Description: 'This is a description',
    Privacy: 'Public',
    CoverPicture: "https://example.com/images/cover.jpg"
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

const UpdatePermissionData = {
    CanInviteOthers: ['user1', 'user2', 'user3'],
    CanPostActivity: ['user4', 'user5'],
    CanUploadPhoto: ['user6', 'user7'],
    CanCreateAlbum: ['user8'],
    CanUploadVideo: ['user9', 'user10']
}

export default {
    PostEventsData,
    PatchEventsCoverData,
    EventsData, EventDataArray,
    UpdatePermissionData
}