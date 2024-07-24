import usersDefinitions from "./usersDefinitions.js";

const MemberData =  {
    EntityId: "discussion123",  // Unique identifier for the discussion
    MemberId: "user456",        // Unique identifier for the member (user ID)
    UserDetails: usersDefinitions.UserData,
    Status: "Accepted",         // Status of the member (Invited or Accepted)
    DocId: "member789",         // Document ID in the database
    Type: "Discussion",         // Type of the entity (Discussion or Event)
    CreatedIndex: 1672531200,   // Timestamp representing when the member was added
    Permissions: {
        IsAdmin: false,         // User does not have admin privileges
        CanInviteOthers: false, // User cannot invite others
        CanPostActivity: true,  // User can post activities
        CanUploadPhoto: true,   // User can upload photos
        CanCreateAlbum: true,   // User can create photo albums
        CanUploadVideo: false   // User cannot upload videos
    }
};


export default {
    MemberData
}