import e from 'express';
import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, UpdateManyUsers } from './../databaseControllers/users-databaseController.js';
import { ReadOneFromOTP, ReadRefreshTokens, SendPasswordOTP, SendRegisterOTP, TokenData, UpdateRefreshToken, VerifyOTP } from './auth-controller.js';
import { AlertBoxObject, ComparePassword, GetUserNonEmptyFieldsPercentage, hashPassword } from './common.js';
import { ReadConnections, UpdateManyConnections } from '../databaseControllers/connections-databaseController.js';
import { ReadFollows, UpdateManyFollows } from '../databaseControllers/follow-databaseController.js';
import { ConnectionStatus } from './connections-controller.js';
import { PostActivityForProfilePatch, PushConnectionToUserActivities } from './activities-controller.js';
import { AddUserDetailsAfterInvited } from './invitations-controller.js';
import { UpdateManyMembers } from '../databaseControllers/members-databaseController.js';
import { ObjectId } from 'mongodb';
import { CreateUserExtendedProperties, MAX_CONNECTIONLIST_SIZE, PullUserExtendedProperties, PushOnceInUserExtendedProperties, ReadUserExtendedProperties, UserExtendedPropertiesInit } from '../databaseControllers/userExtendedProperties-databaseController.js';
import { PullManyActivityExtendedProperties, PushOnceInManyActivityExtendedProperties } from '../databaseControllers/activityExtendedProperties-databaseController.js';




const ApiBaseUrl = "";
const WebUrl = "";
const RegisterUrl = "";


/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData 
 */

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').OtherUserData} OtherUserData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<UserData & OtherUserData>>}
 */
const GetOneFromUsers = async (req, res) => {
    const { UserId } = req.params;
    //@ts-ignore
    let data = await ViewOtherUserData(req.user.UserId, UserId);
    const ProfileCompletionPercentage = GetUserNonEmptyFieldsPercentage(data);
    //@ts-ignore
    data.ProfileCompletionPercentage = ProfileCompletionPercentage;
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<UserData & OtherUserData>>>}
 */
const GetUsers = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter['$or'] = [
            { 'FullName': { $regex: Keyword, $options: 'i' } },
            { 'Username': { $regex: Keyword, $options: 'i' } },
        ]
    }
    // @ts-ignore
    const Users = await ReadUsers(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Users.map(async User => {
        //@ts-ignore
        const OtherUser = await ViewOtherUserRelations(req.user.UserId, User.DocId)
        return { ...User, ...OtherUser };
    }))
    return res.json(data);
}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostUsersRegister = async (req, res) => {

    const Users = await ReadUsers({ Username: req.body.Username }, undefined, 1, undefined);
    if (Users.length > 0) {
        return res.status(444).json(AlertBoxObject("Username already in use", "This username is already taken"));
    }
    const CheckEmailExists = await ReadUsers({ Email: req.body.Email }, undefined, 1, undefined);
    if (CheckEmailExists.length > 0) {
        return res.status(444).json(AlertBoxObject("User with Email already exists", "An account with this email already exists"));
    }
    const User = await UserInit(req.body);
    const OTPId = await SendRegisterOTP(User.Email, User, 'Verify Your Email', res);
    return res.json(OTPId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const VerifyRegistrationOTP = async (req, res) => {
    const { OTP, OTPId } = req.body;
    const OTPData = await VerifyOTP(OTPId, OTP, res);
    //@ts-ignore
    const UserId = await CreateUsers(OTPData.Data);
    //@ts-ignore
    AddUserDetailsAfterInvited(OTPData.Data, UserId)
    AddConnectionstoUser(UserId, UserId);
    const CurrentUser = {
        Role: ["User"],
        UserId
    }
    const LoginData = await TokenData(CurrentUser);

    return res.json(LoginData);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchUsers = async (req, res) => {
    const CheckUserExists = await ReadUsers({ Username: req.body.Username }, undefined, 1, undefined);
    //@ts-ignore
    if (CheckUserExists.length > 0 && CheckUserExists[0].DocId !== req.user.UserId) {
        return res.status(444).json(AlertBoxObject("Username already in use", "This username is already taken"));
    }
    const { UserId } = req.params;
    await UpdateUsers(req.body, UserId);
    await UpdateUserDetails(UserId);
    await PostActivityForProfilePatch(req.body, UserId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const UserLogin = async (req, res) => {
    const { Email, Password } = req.body;
    const Users = await ReadUsers({ Email: Email }, undefined, 1, undefined, false);
    if (Users.length === 0) {
        res.redirect(RegisterUrl);
    }
    const [User] = Users
    if (await ComparePassword(Password, User.Password) === false) {
        return res.status(444).json(AlertBoxObject("Invalid Credentials", "The email or password you entered is incorrect"));
    }
    const CurrentUser = {
        Role: User.Roles,
        UserId: User.DocId
    }
    const LoginData = await TokenData(CurrentUser);

    return res.json(LoginData);
}

/**
 * 
 * @param {boolean} IsEdit 
 * @returns 
 */

const CheckUsernameAvailability = (IsEdit) =>
    /**
     * 
     * @param {e.Request} req 
     * @param {e.Response} res 
     * @returns 
     */
    async (req, res) => {
        const CheckUserExists = await ReadUsers({ Username: req.body.Username }, undefined, 1, undefined);
        if (CheckUserExists.length === 0) {
            return res.json(true)
        }
        //@ts-ignore
        if (IsEdit && CheckUserExists[0].DocId === req.user.UserId) {
            return res.json(true);
        }
        return res.json(false);
    }

/**
 * 
 * @param {string} UserId 
 * @param {string} OtherUserId 
 * @returns {Promise<import('./../databaseControllers/users-databaseController.js').OtherUserData>}
 */
const ViewOtherUserRelations = async (UserId, OtherUserId) => {
    let IsFollowing = false, IsFollowed = false, FollowIndex = 0, FollowingIndex = 0, FollowedIndex = 0;
    const PromiseData = await Promise.all([
        ConnectionStatus(UserId, OtherUserId),
        ReadFollows({ FollowerId: UserId, FolloweeId: OtherUserId }, undefined, 1, undefined),
        ReadFollows({ FolloweeId: UserId, FollowerId: OtherUserId }, undefined, 1, undefined),
    ]);
    const [Connection, Following, Followed] = PromiseData;
    if (Following.length > 0) {
        FollowIndex = Following[0].CreatedIndex;
        FollowingIndex = Following[0].CreatedIndex;
        IsFollowing = true;
    }
    if (Followed.length > 0) {
        IsFollowed = true;
        FollowedIndex = Followed[0].CreatedIndex;
        FollowIndex = Followed[0].CreatedIndex;
    }
    return {
        ConnectionStatus: Connection.Status, IsFollowed, IsFollowing, FollowIndex,
        // @ts-ignore
        FollowingIndex, FollowedIndex, ConnectionIndex: Connection.ConnectionIndex,
    };
}


/**
 * 
 * @param {string} UserId 
 * @param {string} OtherUserId 
 * @param {object} NextIdObject  
 */
const ViewOtherUserData = async (UserId, OtherUserId, NextIdObject = {}) => {
    const PromiseData = await Promise.all([
        ReadOneFromUsers(OtherUserId),
        ViewOtherUserRelations(UserId, OtherUserId)
    ]);
    return { ...PromiseData[0], ...PromiseData[1], NextId: NextIdObject.NextId };
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const SendForgotPasswordOTP = async (req, res) => {
    const { Email } = req.body;
    const [User] = await ReadUsers({ Email }, undefined, 1, undefined);
    if (!User) {
        return res.status(444).json(AlertBoxObject("User with Email does not exist", "User with this email does not exist"));
    }
    const OTPId = await SendPasswordOTP(Email, res);
    return res.json(OTPId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const PatchPassword = async (req, res) => {
    const { OTPId, Password } = req.body;
    const OTPData = await ReadOneFromOTP(OTPId);
    if (OTPData.EmailVerified === false) {
        return res.status(444).json(AlertBoxObject("OTP not Verified", "OTP is not verified. Please verify your email"));
    }
    const [User] = (await ReadUsers({ Email: OTPData.Email }, undefined, 1, undefined));
    const HashedPassword = await hashPassword(Password);
    await UpdateUsers({ Password: HashedPassword }, User.DocId);
    return res.json(true);
}

const CheckIfUserWithMailExists = async (Email) => {
    const [User] = await ReadUsers({ Email }, undefined, 1, undefined);
    return User ? true : false;
}

/**
 * 
 * @param {string} UserId 
 * @returns 
 */
const UpdateUserDetails = async (UserId) => {
    const UserDetails = await ReadOneFromUsers(UserId);
    await Promise.all([
        UpdateManyConnections({ 'UserDetails.$[elem]': UserDetails }, { UserIds: UserId }, { arrayFilters: [{ "elem.DocId": UserId }] }),
        UpdateManyFollows({ 'UserDetails.$[elem]': UserDetails }, { $or: [{ FolloweeId: UserId }, { FollowerId: UserId }] }, { arrayFilters: [{ "elem.DocId": UserId }] }),
        UpdateManyMembers({ UserDetails: UserDetails }, { MemberId: UserId })
    ])
    return;
}

/**
 * 
 * @param {string} UserId 
 * @param {string} ConnectionId 
 */
const AddConnectionstoUser = async (UserId, ConnectionId) => {
    const [ConnectionAdded] = await ReadUserExtendedProperties({ Type: "ConnectionsList", "Content.ConnectionList": ConnectionId, UserId }, undefined, 1, undefined);
    if (ConnectionAdded) {
        return;
    }
    const [checkUserConnections] = await ReadUserExtendedProperties({ Type: "ConnectionsList", UserId, $expr: { $lt: [{ $size: "$Content.ConnectionsList" }, MAX_CONNECTIONLIST_SIZE] } }, undefined, 1, undefined);
    if (checkUserConnections) {
        return await Promise.all([
            PushOnceInUserExtendedProperties({ "Content.ConnectionsList": ConnectionId }, checkUserConnections.DocId),
            PushConnectionToUserActivities(ConnectionId, checkUserConnections.DocId, UserId)
        ]);
    }
    const ConnectionListId = await CreateUserExtendedProperties(UserExtendedPropertiesInit({ UserId, Type: "ConnectionsList", Content: { ConnectionsList: [ConnectionId] } }));
    await PushConnectionToUserActivities(ConnectionId, ConnectionListId, UserId);
    return;
}

/**
 * 
 * @param {string} UserId 
 * @param {string} ConnectionId 
 */
const RemoveConnectionsToUser = async (UserId, ConnectionId) => {
    const [[Follow], [Connection]] = await Promise.all([
        ReadFollows({ FolloweeId: UserId, FollowerId: ConnectionId }, undefined, 1, undefined),
        ReadConnections({ UserIds: { "$all": [UserId, ConnectionId], }, Status: "Connected" }, undefined, 1, undefined)
    ])
    if (Follow || Connection) {
        return;
    }
    const [checkUserConnections] = await ReadUserExtendedProperties({ Type: "ConnectionsList", UserId, "Content.ConnectionsList": ConnectionId }, undefined, 1, undefined);
    return Promise.all([
        PullUserExtendedProperties({ "Content.ConnectionsList": ConnectionId }, checkUserConnections.DocId),
        PullManyActivityExtendedProperties({ "Content.ConnectionsList": ConnectionId }, { UserId })
    ])
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const AddUserAsAdmin = async (req, res) => {
    const { UserIds } = req.body;
    const objectIds = await Promise.all(UserIds.map(async id => {
        const [RefreshToken] = await ReadRefreshTokens({ 'SignObject.UserId': id }, undefined, 1, { Index: "desc" })
        await UpdateRefreshToken(RefreshToken.DocId, { 'SignObject.Roles': ["Admin", "User"] });
        return new ObjectId(id)
    }));
    await UpdateManyUsers({ Roles: ["Admin", "User"] }, { "_id": { $in: objectIds } })
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const RemoveUserAsAdmin = async (req, res) => {
    const { UserId } = req.body;
    const [RefreshToken] = await ReadRefreshTokens({ 'SignObject.UserId': UserId }, undefined, 1, { Index: "desc" })
    await UpdateRefreshToken(RefreshToken.DocId, { 'SignObject.Roles': ["User"] });
    await UpdateUsers({ Roles: ["User"] }, UserId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const GetUsersByRole = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter['$or'] = [
            { 'FullName': { $regex: Keyword, $options: 'i' } },
            { 'Username': { $regex: Keyword, $options: 'i' } },
        ]
    }
    // @ts-ignore
    Filter.Roles = Filter.Role === "User" ?  ["User"]  : { $all: ["User", "Admin"] };
    delete Filter.Role;
    // @ts-ignore
    const Users = await ReadUsers(Filter, NextId, Limit, OrderBy);
    return res.json(Users);
}

/**
 * 
 * @param {UserData} User 
 * @returns {Promise<UserData>}
 */
const UserInit = async (User) => {
    const Password = await hashPassword(User.Password);
    return {
        ...User,
        ProfilePicture: "",
        CoverPicture: "",
        Password,
        Roles: ["User"],
    };
}


/* const SendUserEmailVerification = async (UserData) => {
    const EmailVerification = {
        UserId: UserData.DocId,
        CreatedIndex: moment().valueOf(),
        Verified: false
    }
    const EmailVerificationId = await CreateEmailVerifications(EmailVerification);
    const VerificationLink = `${ApiBaseUrl}/api/users/${EmailVerification.UserId}/verify/${EmailVerificationId}`;
    return AccountVerificationEmail(UserData, VerificationLink);
}

const VerifyUserEmail = async (req, res) => {
    const { EmailVerificationId } = req.params;
    const EmailVerificationData = await ReadOneFromEmailVerifications(EmailVerificationId);
    if (moment(EmailVerificationData.CreatedIndex).add(15, "minute").isAfter(moment())) {
        return res.redirect(`${WebUrl}/${EmailVerificationExpiryRoute}`)
    }
    if (EmailVerificationData.Verified) {
        res.redirect(WebUrl);
    }
    await Promise.all([
        UpdateEmailVerifications({ "Verified": true, VerifiedIndex: moment().valueOf() }, EmailVerificationData.DocId),
        UpdateUsers({ EmailVerification: true }, EmailVerificationData.UserId),
    ])
    return res.redirect(WebUrl);
} */

export {
    GetOneFromUsers, GetUsers, PostUsersRegister, PatchUsers,
    UserLogin, VerifyRegistrationOTP, CheckUsernameAvailability,
    ViewOtherUserRelations, ViewOtherUserData, SendForgotPasswordOTP,
    PatchPassword, CheckIfUserWithMailExists, AddUserAsAdmin, RemoveUserAsAdmin,
    GetUsersByRole, AddConnectionstoUser, RemoveConnectionsToUser
}