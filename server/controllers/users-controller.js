import e from 'express';
import moment from 'moment-timezone';

import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, RemoveUsers, } from './../databaseControllers/users-databaseController.js';
import { AccountVerificationEmail, SendOTPEmail } from './emails-controller.js';
import { CreateEmailVerifications, ReadOneFromEmailVerifications, UpdateEmailVerifications } from '../databaseControllers/emailVerification-databaseController.js';
import { GenerateToken } from './auth-controller.js';
import { getOTP } from './common.js';

const TestUsers = [
    "qwertyui@tgmail.com",
]
const MAXIMUM_RETRIES_OF_OTP = 5;
const ApiBaseUrl = "";
const WebUrl = "";
const RegisterUrl = "";


/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').UserData} UserData 
 */

/**
 * @typedef {import('./../databaseControllers/users-databaseController.js').OTPData} OTPData 
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
 * @param {string} Email 
 * @param {UserData} Data 
 * @param {string} Description
 * @param {e.Response} res 
 * @returns {Promise<string|Error>}
 */
const SendRegisterOTP = async (Email, Data = {}, Description,res) => {
    let TestUser = false;
    if (TestUsers.includes(Email)) {
        TestUser = true;
    }
    const OTP = getOTP(TestUser);

    const ReturnMessage = await SendOTPEmail(Email,OTP,Data.FullName,Description)

    if (ReturnMessage === true) {
        const Now = moment();
        const Date = Now.format("YYYY-MM-DD");
        const Index = `${Now.valueOf()}`;
        const data = { "OTP": OTP, "Email": Email, EmailVerified: false, Index, Date, Data, "NoOfRetries": 0, "NoOfOTPs": 0 };
        const OTPId = await Create("OTP", data);
        return OTPId;
    }
    else {
        res.status(400);
        throw Error(ReturnMessage);
    }
}

/**
 * 
 * @param {string} OTPId 
 * @param {string} OTP 
 * @param {e.Response} res
 * @returns {Promise<OTPData|Error>}
 */
const VerifyOTP = async (OTPId, OTP, res) => {
    /**
     * @type {OTPData}
     */
    const data = await Read("OTP", OTPId);
    if (data === null) {
        res.status(400);
        throw Error("No OTP Generated");
    }
    else if (data.NoOfRetries >= MAXIMUM_RETRIES_OF_OTP) {
        res.status(400);
        throw Error("Maximum number of retries finished");
    }
    else if (data.OTP !== OTP) {
        data.NoOfRetries++;
        await Update("OTP", data, OTPId);
        res.status(400);
        throw Error(`OTP Incorrect. Only ${MAXIMUM_RETRIES_OF_OTP - data.NoOfRetries} tries left`);
    }
    else if (data.PhoneVerified) {
        res.status(400);
        throw Error(`OTP Already Verified.`);
    }
    else {
        data.PhoneVerified = true;
        await Update("OTP", data, OTPId);
        return data;
    }
}
/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostUsersRegister = async (req, res) => {

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
    const { UserId } = req.params;
    await UpdateUsers(req.body, UserId);
    return res.json(true);
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
 * @param {UserData} User 
 * @returns {UserData}
 */
const UserInit = (User) => {
    return User;
}

export {
    GetOneFromUsers, GetUsers, PostUsersRegister, PatchUsers,
    UserLogin, VerifyRegistrationOTP
}