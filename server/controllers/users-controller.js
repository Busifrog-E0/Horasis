import e from 'express';

import { ReadOneFromUsers, ReadUsers, UpdateUsers, CreateUsers, RemoveUsers, } from './../databaseControllers/users-databaseController.js';
import { AccountVerificationEmail } from './emails-controller.js';
import { CreateEmailVerifications, ReadOneFromEmailVerifications, UpdateEmailVerifications } from '../databaseControllers/emailVerification-databaseController.js';
import { GenerateToken } from './auth-controller.js';
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
const PostUsers = async (req, res) => {
    req.body = UserInit(req.body);
    const Verification = await SendUserEmailVerification(req.body);
    if (!Verification) {
        return res.json("Could not send Verification Mail")
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
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteUsers = async (req, res) => {
    const { UserId } = req.params;
    await RemoveUsers(UserId);
    return res.json(true);
}

/**
 * 
 * @param {UserData} User 
 */
const SendUserEmailVerification = async (User) => {
    const EmailVerification = {
        UserId : User.DocId
    }
    const EmailVerificationId = await CreateEmailVerifications(EmailVerification);
    const VerificationLink = `/${EmailVerificationId}`;
    const { Name } = User;
    const VerificationNote = await AccountVerificationEmail(User, { name: Name, verification_link: VerificationLink });
    if (VerificationNote != true) {
        return false;
    }
    return true;
}

const VerifyUserEmail = async (req, res) => {
    const { EmailVerificationId } = req.params;
    const {UserId} = await ReadOneFromEmailVerifications(EmailVerificationId);
    await UpdateUsers({ EmailVerification: true }, UserId);
    const CurrentUser = {
        Role: 'User',
        UserId
    }
    const { Token, RefreshToken } = GenerateToken(CurrentUser);
    // redirecting code here
    return res.json({
        CurrentUser,
        Token,
        RefreshToken
    });
}

const UserLogin = async (req, res) => {
    const { Email, Password } = req.body;
    const [User] = await ReadUsers({ Email: Email }, undefined, 1, undefined);
    if (User.Password === Password) {
        const CurrentUser = {
            Role: 'User',
            UserId : User.DocId
        }
        const { Token, RefreshToken } = GenerateToken(CurrentUser);

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
 * @param {object} User 
 * @returns 
 */
const UserInit = (User) => {
    return {
        ...User,
        EmailVerification: false
    }
}

export {
    GetOneFromUsers, GetUsers, PostUsers, PatchUsers, DeleteUsers,
    UserLogin,VerifyUserEmail
}