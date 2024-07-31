const UserRegisterData = {
    "FullName": "John Doe",
    "Email": "john.doe@example.com",
    "Username" : "johndoe",
    "Password": "password123",
    "Country": "USA",
    "City": "New York",
    "JobTitle": "Software Engineer",
    "Industry": "Technology",
    "CompanyName": "Tech Corp",
    "About": "Experienced software engineer specializing in full-stack development."
};

const UserLoginData = {
    "Email": "john.doe@example.com",
"Password": "password123",
}

const UserData = {
    "FullName": "Jane Doe",
    "Username": "janedoe",
    "Email": "jane.doe@example.com",
    "DocId": "abc123DEF",
    "Country": "Canada",
    "City": "Toronto",
    "JobTitle": "Product Manager",
    "Industry": "Software",
    "CompanyName": "InnovateTech",
    "About": "Seasoned product manager with over 10 years of experience in the software industry.",
    "CoverPicture": "string",
    "ProfilePicture": "string",
}

const OTPVerifyData = {
    "OTP": "123456",
    "OTPId" : "string"
}

const PatchUserData = {
    FullName: "John Doe",
    Username: "johndoe",
    Country: "USA",
    CompanyName: "Tech Corp",
    About: "Experienced developer",
    JobTitle: "Software Engineer",
}
const UserDataArray = [UserData]

const LikedUsersData = [{
    UserDetails: {
        "FullName": "Jane Doe",
        "Username": "janedoe",
        "Email": "jane.doe@example.com",
        "DocId": "abc123DEF",
        "Country": "Canada",
        "City": "Toronto",
        "JobTitle": "Product Manager",
        "Industry": "Software",
        "CompanyName": "InnovateTech",
        "About": "Seasoned product manager with over 10 years of experience in the software industry.",
        "CoverPicture": "string",
        "ProfilePicture": "string",
    },
    ActivityId: "string",
    UserId : "string"
}]

const GetMediaArray = [{
    FileUrl: "string",
    Type: "image",
}]

export default {
    UserRegisterData,OTPVerifyData,
    UserLoginData,
    UserData,
    PatchUserData,
    UserDataArray, LikedUsersData,
    GetMediaArray
    
}
