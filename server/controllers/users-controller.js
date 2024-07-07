import e from 'express';
import moment from 'moment-timezone';

import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, RemoveUsers, } from './../databaseControllers/users-databaseController.js';
import { AccountVerificationEmail } from './emails-controller.js';
import { CreateEmailVerifications, ReadOneFromEmailVerifications, UpdateEmailVerifications } from '../databaseControllers/emailVerification-databaseController.js';
import { GenerateToken } from './auth-controller.js';

const ApiBaseUrl = "";
const WebUrl = "";
const EmailVerificationExpiryRoute = "";

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

    // email already exists? - vedanth

    UserInit(req.body);
    // No docid in req.body
    // first create doc then sent mail
    const Verification = await SendUserEmailVerification(req.body);
    if (!Verification) {
        return res.json("Could not send Verification Mail");
    };
    await CreateUsers(req.body);
    return res.json(true);
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

/**
 * 
 * @param {UserData} UserData 
 */
const SendUserEmailVerification = async (UserData) => {
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
}

const UserLogin = async (req, res) => {
    const { Email, Password } = req.body;
    const [User] = await ReadUsers({ Email: Email }, undefined, 1, undefined, false);
    // - vedanth
    // exist conditions first

    // check email exists else route to register

    // then password wrong check

    // then logic

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
    return res.json("Wrong Password");
}


/**
 * 
 * @param {UserData} User 
 * @returns {UserData}
 */
const UserInit = (User) => {
    User.EmailVerification = false;
    return User;
}

export {
    GetOneFromUsers, GetUsers, PostUsersRegister, PatchUsers,
    UserLogin, VerifyUserEmail
}