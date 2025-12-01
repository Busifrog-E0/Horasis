import e from 'express';
import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, UpdateManyUsers } from './../databaseControllers/users-databaseController.js';
import { AdminRoleArray, MaintainAdminRoleArray, ReadOneFromOTP, ReadRefreshTokens, SendPasswordOTP, SendRegisterOTP, TokenData, UpdateRefreshToken, VerifyOTP } from './auth-controller.js';
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
import { CreateUserRegistrations, ReadUserRegistrations, UpdateUserRegistrations } from '../databaseControllers/userRegistrations-databaseController.js';
import Env from '../Env.js';




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
            { 'IsPrivate': false, 'City': { $regex: Keyword, $options: 'i' } },
            { 'IsPrivate': false, 'Country': { $regex: Keyword, $options: 'i' } },
            { 'IsPrivate': false, 'Email': { $regex: Keyword, $options: 'i' } },
            { 'IsPrivate': false, 'Interests': { $regex: Keyword, $options: 'i' } },
            { 'IsPrivate': false, 'Industry': { $regex: Keyword, $options: 'i' } }
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
 */
const PostCheckIfRegisterCodeExists = async (req, res) => {
    return res.json((await CheckIfRegisterCodeExists(req.body.RegisterCode)));
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const PostUsersRegisterWithCode = async (req, res) => {

    if (!(await CheckIfRegisterCodeExists(req.body.RegisterCode))) {
        return res.status(444).json(AlertBoxObject("Invalid Code", "This Code is InValid"));
    }

    const Users = await ReadUsers({ Username: req.body.Username }, undefined, 1, undefined);
    if (Users.length > 0) {
        return res.status(444).json(AlertBoxObject("Username already in use", "This username is already taken"));
    }
    const CheckEmailExists = await ReadUsers({ Email: req.body.Email }, undefined, 1, undefined);
    if (CheckEmailExists.length > 0) {
        return res.status(444).json(AlertBoxObject("User with Email already exists", "An account with this email already exists"));
    }
    const User = await UserInit(req.body);
    const UserId = await CreateUsers(User);
    await AddUserDetailsAfterInvited(User, UserId)
    await AddConnectionstoUser(UserId, UserId);

    const [UserRegistrations] = await ReadUserRegistrations({ "RegistrationCode": req.body.RegisterCode }, undefined, 1, undefined);

    await UpdateUserRegistrations({ AlreadyUsed: true, UserData: User }, UserRegistrations.DocId);


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
 */
const PostUsers = async (req, res) => {

    const Users = await ReadUsers({ Username: req.body.Username }, undefined, 1, undefined);
    if (Users.length > 0) {
        return res.status(444).json(AlertBoxObject("Username already in use", "This username is already taken"));
    }
    const CheckEmailExists = await ReadUsers({ Email: req.body.Email }, undefined, 1, undefined);
    if (CheckEmailExists.length > 0) {
        return res.status(444).json(AlertBoxObject("User with Email already exists", "An account with this email already exists"));
    }
    const User = await UserInit(req.body);
    await CreateUsers(User);
    return res.json(true);
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
        return res.status(444).json(AlertBoxObject("Invalid Credentials", "The email or password you entered is incorrect"));
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
    // @ts-ignore
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
        const id = new ObjectId();
        return res.json(id.toString());
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
/**
 * 
 * @param {string} Email 
 * @returns 
 */
const CheckIfUserWithMailExists = async (Email) => {
    const [User] = await ReadUsers({ Email }, undefined, 1, undefined);
    return User ? true : false;
}

/**
 * 
 * @param {string} RegisterCode 
 * @returns {Promise<boolean>}
 */
const CheckIfRegisterCodeExists = async (RegisterCode) => {
    const [User] = await ReadUserRegistrations({ "RegistrationCode": RegisterCode }, undefined, 1, undefined);
    if (!User) return false;
    if (User.AlreadyUsed) return false;
    return true;
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
    /**@type {string[]} */
    const UserIds = req.body.UserIds;
    const objectIds = await Promise.all(UserIds.map(async id => {
        const [RefreshToken] = await ReadRefreshTokens({ 'SignObject.UserId': id }, undefined, 1, { Index: "desc" })
        await UpdateRefreshToken(RefreshToken.DocId, { 'SignObject.Role': ["Admin", "User"] });
        MaintainAdminRoleArray(id, "Add");
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
    await UpdateRefreshToken(RefreshToken.DocId, { 'SignObject.Role': ["User"] });
    MaintainAdminRoleArray(UserId, "Remove");
    await UpdateUsers({ Roles: ["User"] }, UserId);
    return res.json(true);
}


const GenerateRegistrationCode = async () => {

    /**
     * 
     * @param {string[]} AlreadyGeneratedCodes 
     * @returns 
     */
    const RegCodeCreator = async (AlreadyGeneratedCodes = []) => {

        let generator = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyskiouhjnmbhj'

        for (let i = 0; i < 25; i++) {
            generator += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        if (AlreadyGeneratedCodes.includes(generator)) {
            return RegCodeCreator(AlreadyGeneratedCodes);
        }
        const [checkUserExists] = await ReadUserRegistrations({ "RegistrationCode": generator }, undefined, 1, undefined);
        if (checkUserExists) {
            return RegCodeCreator();
        }
        return generator;

    }

    /**@type {string[]} */
    const generatedCodes = [];
    for (let i = 0; i < 250; i++) {
        const code = await RegCodeCreator(generatedCodes);
        await CreateUserRegistrations({ RegistrationCode: code, AlreadyUsed: false, RegistrationLink: `${Env.NEW_USER_WITH_REGISTRATION_CODE}?code=${code}` });
    }


}


const CreateNewCodes = async () => {
    const Codes250 = [
        "j7606Gqq1iEnow0sAghv28hQL",
        "iyLPssqlhAfp5YRceiVjm2bw0",
        "19y9gkvhSWSrbY987QmfircVu",
        "2FF2eE3aNVHIZ55l61nWahrIW",
        "dLZLt48GsiyF3iJsPerbsWxsG",
        "sMHiwyCuLkipj5xJsVWjWijt3",
        "RGSq2s40svabmjZTxoQkuhpij",
        "JPIj44qbyUdaxSIvV7CXnP0Fc",
        "KnefnpjvG6GbGj3nSebfNDbR5",
        "3AckOfDiBsjH3OmFLSonumlag",
        "FweoPacsrVd3rmBf4iNb29TUi",
        "su5yIDftIGIxJRhsXkGa4BMZ1",
        "snTnwsKiWcCsRdd6mBIjmBmrj",
        "R0ki8l8JQqccOR0gkhNsowI4J",
        "LcPkL05jB6sbn5xSjP9WPm4uj",
        "0Jkamxla8wBHQIWnikhhEq8No",
        "0AdSAVdjG6DOuCTmW0kl0Jrwt",
        "Si6iDEnXjxM2abuauXbbPHjqG",
        "eg8oqhhSya637LjHhob51npuw",
        "1MeRuUb8xFYoxnSUpU5pjva74",
        "hSaiu7EFu6rLrjfh5UjS0lvkF",
        "bJHEi3ejNRI6jOM4xYbykb8I8",
        "IBgbfaIUqJg0blhJOu2msIUI1",
        "XR4PPRW5rvwojFXHeJ5gxHnjb",
        "DGmZR52hKrPQhkikLnbnuKXsi",
        "NOosRHUKn1LmXjW0qlKPWHMgf",
        "i8RTsN26BEj5SSiGV53opUutS",
        "wb5jkGuOm6nYjD9gbTFoEysVD",
        "Nhi30Z5jfGoaWFqSgUcodpgaO",
        "SE5MlJmboil18foFQ8jMBh51g",
        "9nknWBFpoZDUOKmN1lHtdng80",
        "y13gckhC6posaDecrFSiqnocF",
        "QPoj0xhshDEYsmjaapLUYjl2a",
        "kvWHBags4JufisLYJcHk8j5kh",
        "An3m2AFvjLUbjhwuqjfdbAItj",
        "d3WAk8iEcfjT4uNx33bV54XgG",
        "6hCnEenwo2h5uoDh4aIodDUkw",
        "ovuX8PhyaIDhuJxsIdiS0bmGm",
        "gFxUuKJhjPwliZNXlYPiD2Vsl",
        "Va1ErwubjURh0KuFGq0Kx98Sj",
        "pJPfuHGyke6RhnkW0XI6sg3Bu",
        "ydqOU66un3qobFmALAu54mG38",
        "8WujEwbjAsNpoqg40I4vmVFAh",
        "BVkj6Bv6B31MTtl8h1akoo1Wy",
        "sCemw12dvOoKNfog4trZXZSjM",
        "wTirn0Q0MleRk3jBx8mQFdhmM",
        "VWCs2biam7hIniIRECuj3AnyF",
        "kgVGDUMubwoP2QjU0jVhAtulO",
        "quPHpmFul33F95jIyTKq0mShf",
        "hynhUEho9qLhQPIhPpwkmj1kJ",
        "tg8whlPfwujb5Qehniuoej6CU",
        "hZWFjmKDjuGs3XalhjuY11oZ8",
        "oQfUVXlrU9hoMCxA1Hq42HZkn",
        "VUaric2kdhDkh9PLFsjrbxRZZ",
        "eumhmJskNOmReuuRmnhsRlBkh",
        "kCahbquNjgutCp6kOI50foUcq",
        "s8h5hw2jpXuf5eaRoxhi3xERo",
        "DesEAh2XEhAkcqrtmAmA2FhkH",
        "gp6W1DJxokhivBFT2arHIhnGu",
        "wCYkaBiaH5XDdjJAWhA9Bhjda",
        "n4ZWKJHgmcxEDHmhhoqkq3Yqn",
        "Fj35e0oBXoP8VVWkLoPswsxqE",
        "6yvACKnjs2rb10h6iSdsbxN8i",
        "cVdrS87v2V6hhwQD4oFjktCm4",
        "UssoaUx1waucbPWlX2Gvjujah",
        "lQnYEmKJiTokTVYbHkUZ1YuVW",
        "w7VehCqqiZ9CpghtYmXpnhVu9",
        "nx8fxsI8RiPniBMjjm62SOh7O",
        "WiiVbkBBjYgSNxoRPN13YTs3g",
        "k086huSLB1wL49LsvkMhLh8jN",
        "ATKOsBWeXor26xFp4YG6N1SiY",
        "XKGhRhsNk7qnCooL7n8n8tarQ",
        "8D419jqLpuKijChfZutdK3jhD",
        "FjQiRgHhohbuvHosSoEWZdiJP",
        "Zg3gaK2hhjAlBWkm2p1KFdsnu",
        "1qieVtsJjoiGtjV8Tb6YoLHbQ",
        "TWIHNjFhhFdWhyXdqRWWmL3uU",
        "GPVCCCPinpHK0ZnkZJ8kRBkCv",
        "WobIqgSFCiBHh2pMunSsJ9x7n",
        "iG1qlwAWL6KM55UcucfBgWlrW",
        "nCF7uAdYOO70iolT4ZDXGyiZg",
        "xHlPeuciWyhiroJOSkD9uXws3",
        "as1muLYaiqjpEAGstkiQf9H0m",
        "kubc3pDNZIDJtYM8Qwk0chtLw",
        "jljmyl8sfDvn43b48diRr0nkA",
        "Q5y6omw3HChsVlnYvhw3b5gnk",
        "oVcrmJks5in8UDkRlFoh4Cycb",
        "yjsvSJkVJrjFiTPE7xhOcmuhj",
        "ajNVjCbv2nkE2kNwtYdvAoAuu",
        "baK9ZaH1AvNsn1vlI60JcjCmY",
        "miGfGuOwit3r2IjWmJAr1HA52",
        "SAHhj6kIlcIuwrruI3rX5DmVm",
        "uujQjl5Ga2oBhK2UkZiMAbdhw",
        "cRkVV5anMPuHAZHiuJVsbsGsO",
        "TG0XswDUaNKnnoQexj6Fu6QbD",
        "7CVkujhxiEPAnbcnbJkYnOUHQ",
        "Z5Sv6bRKYxier723RQIskQry9",
        "FHYbmThsUynswkB6sSrkW5PBi",
        "RijNWFsxA6ounUcZ36eVaBZs7",
        "X2Cr5kkQbmfP5ngmCtUmf6ch7",
        "0VUmEyKnT1hfBd7kH7bnknKTZ",
        "130j3U4ulNgtOwnwmhyi3Z544",
        "0hlHcaS2riS5oBtwPr5mjjtno",
        "dNhJ85QSnkutfhim8uwOh5apa",
        "OxV8oGRGhQxHnsinjsoVVNCNw",
        "JrGk7tdRHqjoJmnlfoHjrV4GA",
        "R1hxUwHa7CYWY9qJjquiKEadY",
        "JiTfmW6hj5ctamn7jrHoccTXk",
        "oZhVSsodUwKQUUW405h2Mk31n",
        "rA8YaR2Jr3oYSoovnhrFPjTp6",
        "hZiaQ1LPjukcUXnK9nlqOZ1bp",
        "4a4gkk56ddKmEAwDiu6YhseOa",
        "27ZwtUs1iJ9tmjsswYh7Gsfhp",
        "bj0X8KbkkjTogqh1mmeNXsUKQ",
        "ujdt2mZCopauk22oXfqo89JQH",
        "TGAdsMShiCu46DGs5vjrRokJo",
        "ILmOvxk8uNRGQZksnns83CcXb",
        "gtswxF4aqHJYOhQtOoeph9ZIk",
        "xKNuwn232w1yrLb0ScoKhgPmj",
        "Kku2oNTwe2Ce0jmhku5xKo9af",
        "Z4CiwTsVsOsMssDnI1G2CXSZi",
        "1B3lPvF8kkjeuTdeunVysLjr8",
        "HuUKpNViL67TXhtHpWsrIs1Ki",
        "hng2GmbgSIhYIBb0hXLMjPw1D",
        "GdNAUjCA1bUw9KhHON4jj31oj",
        "hbKgiJPpqjmmbpKcSyKWOQg09",
        "4XunlmUX8DMk53wfiskn6tr0b",
        "CbvG3himsThUHb4QZhWpv2Ecg",
        "hPiMjOjbyk6M4TdBj2EmZQ0Yo",
        "vFspbiNEhclhb8u9XnShhk9Ek",
        "ijcXHSCd18faADs4jV1snoRTu",
        "kiOWsmhnAvDSbQwqnRS9S3bNq",
        "mhnGp9ehuEoYflmsQlSHnB6WO",
        "ph2PGe9PZh4VEVMhAJWv3oW2a",
        "Emgsn9cutihtctjk7T2s7jjAN",
        "0hjf7jiYZHKIei4BLVwjiP3a7",
        "kORsATjS3yLXNAhlbwOhD7ZmW",
        "vbQ5KPfrhYKiKscnlMGuNLd8m",
        "VnUq5IbuhQUS3LW8QiDZWOMBK",
        "TPo0KZXyAqDw1uaIhkHhfissr",
        "iUFvo8xqSSZ7svXjacYZRCceW",
        "GliUTYsnkhJEJgePg8Q7xwiBe",
        "P5R2cqoII34CGbmjdjc5IZTry",
        "hvSiqsQxeJfqmdcwnofHPjb80",
        "hTEosH00n2LHit94o4nbRyTlQ",
        "mNobhWebEspW8YjxgmCjbdb4A",
        "8SaCTmdDhSkiDas4fh6Ymj6Gi",
        "jyks36uTDmFSMQ5tePb2KDhxj",
        "ehdXGnqI7HjWKfZrFr1nAhMpk",
        "Iu0CSjplK8VhtI8THkNribQN4",
        "Qihuj97RhDY6PUAykhZNQEnLB",
        "wg6cXopaOEHXIyydxXWA3PHjl",
        "bIcbgQTugWbW8mZmZOvn1qle8",
        "XP5ohlusr2RSiYyVowJKejICY",
        "mtplWjjLoKoEw67uEskyge30D",
        "5u0ZdGTobuhMVmkiiqmDnfLuA",
        "SnNHbDEHbInievQylHkj7lXlq",
        "0Wd8i2D6UB5rL6NBSmnsjyTtj",
        "ggvHYsah5MCn6ZEsVg0HfKj78",
        "dEb33mcsfPaUhyoQuOGJscr4w",
        "4FWji8tYamyRYX4jIVlX6rDPQ",
        "EsccNMMrSGSjYjlmubQcRjYPn",
        "mD9iJCUhDaf0n9jXjY6gYvl8g",
        "kD6ElM5GJWNQh0rihamiPjqMv",
        "ZY02nXJFXse0MyVlAUgVoFslc",
        "j7FDuswIholhnfeIfxMjksicV",
        "uiODnJ9jpSYDFPd1TnB7yRYr5",
        "PDpToyi0QXY3eSmJFLnBk1sof",
        "rmhgdrmgPe1l4Y0IRLvUMfX0E",
        "31Qn1rlhx69cmBjQgOX8E4CCB",
        "RjpfhT9y0ajiFqLMyp3qX977j",
        "8c10xOY1YmAGmldeJEDhLgWpn",
        "btQx6wL5FImiaMIoGmkAUm9R5",
        "CojmahwmiDPsGdvwoiRC4q5bt",
        "Zt2N0jbQeWebQQbDYVwoIOW54",
        "y17mxoontpeHfRRXM2hJeoR4j",
        "9kdwjUTR0opibtmajrrhrJyC9",
        "bhuvjGbnjj9nh5ah3qjQLnfGi",
        "JpbWhjZNUKNC64jHmIokMtquU",
        "8iUinj00o3FQMvkxXQki8tZYh",
        "VckjeKQK09a7Fq3q5tBnunJoV",
        "Vj2MkyhxdicIDWFjByau6kD3u",
        "n9HkOscFusfibScNhSkQuV8vG",
        "BkL1HxRcaMsBObpGleJn0imem",
        "fijPihs9NFKP44sYvo5kuWuhs",
        "WVkaO20duIqud3jgYjGvnhbRg",
        "9KhPHhqS3fpLwl2HyboqTcwqo",
        "K3tSk1n5nmgufC9bCf6F2qQEU",
        "pBi0OKo4ZGlPqQDhWoJWCbmeK",
        "BZXOhT91cKqehULls7oswE4hv",
        "D3uZHND7U311UurSISlGlThss",
        "94kEckZosfbhakYRIsLjtXbuF",
        "xNxk5mwLe3buOsmxay8p1a3vu",
        "riqFkjaNj3JxIq6KJLKicD4jM",
        "DL1dJ48sNdDsOq6qsrqS0F7df",
        "edSwU77ivl6wZ0inKYGb9dVik",
        "4qmBj02knJUUgXLKCs703qokt",
        "nVecm2kuhhO8cthcqjPM6njob",
        "qA0bjrioThniThITYcCPj4rpo",
        "WfSjohrfZLhlsjMaxSkq3Kpuj",
        "YiCZZJhNusyffAdtk3cndI51m",
        "Q05yVpcGqyFikdjQhRqGe4in7",
        "93wTmDjCmjSiX4Fhh5lTjpIiL",
        "WM2TPh0t6aO0laipj77iEpfBy",
        "8ui05EkjncmKGHYiksXwrbZsn",
        "sXg4uuuMIhVTuRVncxpT4sM2f",
        "lUh7iJha2A3HR2ijiLu4VsspY",
        "irWVmosCygoKjVldoiusNrLbI",
        "bErmidbduXtjEsSVonFY62CXb",
        "J2j0vqKhyn5iRQ5u27jOhsyZW",
        "HjkPu7kbdI7nB7GGbE8r9MFs8",
        "L7q6BnjkjWiwk7qRk0LjsM0iY",
        "DNyGmo5RPwZhYkbgejGkKsA1Y",
        "5kAl5rjAIyjEhQokhkd1eb6n9",
        "bYMJBpdoo8iPdc4HnPj8tQhjc",
        "PI9i0ImxTmPAAkja7nZuAgS6j",
        "MGjjaAvTfijjrgoF068jyVvjy",
        "WjKQwp93h7SAohohhhWkwwuWa",
        "hmu2ok7hRLtnte0SSv7WbbuTL",
        "N69QXbT5C8vjsAEc1tWdlM03m",
        "IQhhi0UKwSqemiyvoGFV4MtRg",
        "hTuE3Qv3UaWSbjkPH3ibjT2yn",
        "23Dp8AUikuu0dLjhuP1orejmo",
        "DHjL9fLddGIKUj58SV3p3PF6M",
        "j6NsmNu7pZFhcgOpMpELrYBuJ",
        "iuVucibx7X2njsSZWJsPyTxjn",
        "3bjpOPlcj0jfWD6ualobfL2Rp",
        "of4OjtRYdurNOvSZHsDThgbx1",
        "G3aER2vQUK1JphfSGlsYdfPS5",
        "0GD1h2VCuukmFwyjhXcyLhUbj",
        "et0C9FSsuiYINEwEsEsAgHuGN",
        "hEmLQpPTh1HC0iCsqhIni9iou",
        "bJZRbDahfmtj6WmSOvdufGT5B",
        "JywfrInobiumFkRklusGRZNti",
        "bkeSYBdMRpyiZabNslsZVkaFs",
        "FM05Wo8TWlpaofhqj4dbLXOuw",
        "gxPFEgDbs3Ns0ma33yFunLC0J",
        "9JRsOA3iLsBqkvuHuIsq63Hjf",
        "tPydZEUtBQp0GMyadFmiE7i8i",
        "a2gFsDSti8iUmTyyhn0vocraA",
        "yiwrvtXDLtMki77EOsu5in3CO",
        "Mlm2hKT2Q4uxiwudYg3u0QGf7",
        "6R0s6tQnR9EnwS9nfrKlNOusy",
        "sOOWhS6mDfkoKhItCKTrhLeKh",
        "nqHfito3YCI8cK7A14capHnot",
        "KksMSXrEMofpGohjLhEhubywI",
        "mSrksHRIjSlLuShxxBoEeMt8v",
        "cmq1kIlN9skdvhhsE5jbJ7B3k",
        "4Fe50hBibRQl1Yairo4ocjphl",
        "oqoiTGj4kj2EjqMyQZoMlAuQU"
    ];
    for (let i = 0; i < Codes250.length; i++) {
        const code = Codes250[i];
        await CreateUserRegistrations({ RegistrationCode: code, AlreadyUsed: false, RegistrationLink: `https://social.horasis.org/register?code=${code}` });
    }
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
    Filter.Roles = Filter.Role === "User" ? ["User"] : { $all: ["User", "Admin"] };
    // @ts-ignore
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

export {
    GetOneFromUsers, GetUsers, PostUsersRegister, PostUsers, PatchUsers,
    UserLogin, VerifyRegistrationOTP, CheckUsernameAvailability,
    ViewOtherUserRelations, ViewOtherUserData, SendForgotPasswordOTP,
    PatchPassword, CheckIfUserWithMailExists, AddUserAsAdmin, RemoveUserAsAdmin,
    GetUsersByRole, AddConnectionstoUser, RemoveConnectionsToUser,
    PostCheckIfRegisterCodeExists, PostUsersRegisterWithCode,
}