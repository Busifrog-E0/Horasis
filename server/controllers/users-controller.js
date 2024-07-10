import e from 'express';
import moment from 'moment-timezone';

import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, RemoveUsers, } from './../databaseControllers/users-databaseController.js';
import { AccountVerificationEmail, SendOTPEmail } from './emails-controller.js';
import { CreateEmailVerifications, ReadOneFromEmailVerifications, UpdateEmailVerifications } from '../databaseControllers/emailVerification-databaseController.js';
import { GenerateToken, SendRegisterOTP, VerifyOTP } from './auth-controller.js';
import { getOTP } from './common.js';
import { ReadConnections } from '../databaseControllers/connections-databaseController.js';
import { ReadFollows } from '../databaseControllers/follow-databaseController.js';



const ApiBaseUrl = "";
const WebUrl = "";
const RegisterUrl = "";


/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData 
 */


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<UserData>>}
 */
const GetOneFromUsers = async (req, res) => {
    const { UserId } = req.params;
    const data = await ReadOneFromUsers(UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<UserData>>>}
 */
const GetUsers = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadUsers(Filter, NextId, Limit, OrderBy);
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
        return res.status(444).json("Username already in use");;
    }
    const CheckEmailExists = await ReadUsers({ Email: req.body.Email }, undefined, 1, undefined);
    if (CheckEmailExists.length > 0) {
        return res.status(444).json("User with Email already exists");
    }
    const User = UserInit(req.body);
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
    const CurrentUser = {
        Role: "User",
        UserId
    }
    const { Token, RefreshToken } = await GenerateToken(CurrentUser);
    return res.json({
        CurrentUser,
        Token,
        RefreshToken
    })
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
        return res.status(444).json("Username already in use");
    }
    const { UserId } = req.params;
    await UpdateUsers(req.body, UserId);
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
    if (User.Password !== Password) {
        return res.status(444).json("Invalid Credentials");
    }

    if (User.Password === Password) {
        const CurrentUser = {
            Role: 'User',
            UserId: User.DocId
        }
        const { Token, RefreshToken } = await GenerateToken(CurrentUser);

        return res.json({
            CurrentUser,
            Token,
            RefreshToken
        });
    }
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
const ViewOtherUser = async (UserId, OtherUserId) => {
    let IsConnected = false, IsFollowing = false, IsFollowed = false;
    const Connection = await ReadConnections({ UserIds: { $all: [UserId, OtherUserId] }, Status: "Connected" }, undefined, 1, undefined);
    const Follows = await ReadFollows({
        '$or': [{ FollowerId: UserId, FolloweeId: OtherUserId },
        { FollowerId: OtherUserId, FolloweeId: UserId },
        ]},
        undefined, 2, undefined);
    for (const follow of Follows) {
        if (follow.FolloweeId === UserId) {
            IsFollowed=true;
        }
        if (follow.FollowerId === UserId) {
            IsFollowing = true;
        }
    }
    if (Connection.length > 0) {
        IsConnected = true;
    }
    return { IsConnected, IsFollowed, IsFollowing };
}

/**
 * 
 * @param {UserData} User 
 * @returns {UserData}
 */
const UserInit = (User) => {
    return User;
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
    ViewOtherUser
}