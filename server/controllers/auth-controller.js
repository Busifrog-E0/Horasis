import e from "express";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import dataHandling from '../databaseControllers/functions.js';
import { getOTP } from "./common.js";
import { ForgotPasswordOTPEmail, SendOTPEmail } from "./emails-controller.js";
import moment from "moment";
import { ReadUsers } from "../databaseControllers/users-databaseController.js";
const { Read, Create, Delete, Update } = dataHandling;

const TestUsers = [
    "qwertyui@tgmail.com",
]
const MAXIMUM_RETRIES_OF_OTP = 5;
/**
 * @typedef {import("../databaseControllers/users-databaseController.js").UserData} UserData
 */

/**
 * @typedef {object} RefreshTokenData
 * @property {object} SignObject
 * @property {string} Token
 * @property {boolean} Valid
 * @property {string} DocId
 */

/**
 * @typedef {object} OTPData
 * @property {UserData} Data
 * @property {string} OTP
 * @property {string} Date
 * @property {number} Index
 * @property {number} NoOfRetries
 * @property {number} NoOfOTPs
 * @property {number} Email
 * @property {boolean} EmailVerified
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<any>>}
 */
const ModelLogin = async (req, res) => {
    const { EnrollmentId, PhoneNumber } = req.body;
    const UserData = await {};
    if (UserData === false) {
        return res.status(403).json({ "status": "error", "message": "Invaid Credentials" });
    }
    const { Token, RefreshToken } = await GenerateToken({ EnrollmentId, PhoneNumber });
    UserData.Token = Token;
    return res.json({ Token, RefreshToken });
};

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 */
const RefreshToken = async (req, res) => {
    const { Token, RefreshToken } = req.body;
    /**
     * @type {RefreshTokenData}
     */
    const RefreshTokenData = await Read("RefreshTokens", RefreshToken);
    if (!RefreshTokenData || RefreshTokenData.Token !== Token || RefreshTokenData.Valid !== true) {
        res.status(445).json("InValid");
    }
    else {
        try {
            jwt.decode(RefreshTokenData.Token, { complete: true });
            const responseObject = await GenerateToken(RefreshTokenData.SignObject);
            await Delete("RefreshToken", RefreshTokenData.DocId);
            res.json({ ...responseObject, CurrentUser: RefreshTokenData.SignObject });
        } catch (error) {
            res.status(445).json(error.message);
        }
    }
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const CheckOTP = async (req, res) => {
    const { OTPId, OTP } = req.body;
    const OTPData = await VerifyOTP(OTPId, OTP, res);
    return res.json(true);
}

/**
 * 
 * @param {object} SignObject 
 */
const GenerateToken = async (SignObject) => {
    const Token = jwt.sign(SignObject, ENV.TOKEN_KEY, { expiresIn: "2h", });
    const RefreshToken = await Create("RefreshTokens", { SignObject, "Token": Token, "Valid": true });
    console.log(Token);
    return { "Token": Token, "RefreshToken": RefreshToken };
}

/**
 * @param {string} Email 
 * @param {UserData} Data 
 * @param {string} Description
 * @param {e.Response} res 
 * @returns {Promise<string|Error>}
 */
const SendRegisterOTP = async (Email, Data, Description, res) => {
    let TestUser = false;
    if (TestUsers.includes(Email)) {
        TestUser = true;
    }
    const OTP = getOTP(TestUser);

    const ReturnMessage = true;
    // await SendOTPEmail(Email, OTP, Data.FullName)

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
 * @param {string} Email 
 * @param {e.Response} res 
 * @returns {Promise<string|Error>}
 */
const SendPasswordOTP = async (Email, res) => {
    let TestUser = false;
    if (TestUsers.includes(Email)) {
        TestUser = true;
    }
    const OTP = getOTP(TestUser);
    const [User] = (await ReadUsers({ Email }, undefined, 1, undefined));
    const ReturnMessage = true;
    //await ForgotPasswordOTPEmail(Email, User.FullName, OTP)

    if (ReturnMessage === true) {
        const Now = moment();
        const Date = Now.format("YYYY-MM-DD");
        const Index = `${Now.valueOf()}`;
        const data = { "OTP": OTP, "Email": Email, EmailVerified: false, Index, Date, "NoOfRetries": 0, "NoOfOTPs": 0 };
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
    else if (data.EmailVerified) {
        res.status(400);
        throw Error(`OTP Already Verified.`);
    }
    else {
        data.EmailVerified = true;
        await Update("OTP", data, OTPId);
        return data;
    }
}

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<RefreshTokenData>>} Returns DiscussionData
 */
const ReadRefreshTokens = async (Where, NextIndex, Limit, orderBy) => {
    return await Read("RefreshTokens", undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @param {object} data 
 * @returns 
 */
const UpdateRefreshToken = async (DocId, data) => {
    return await Update("RefreshTokens", data, DocId);
}

const ReadAdminRoleArray = async (UserId) => {
    return (await Read("PendingAdminRoles", undefined, undefined, undefined, { "AdminArray": UserId }))[0];
}

/**
 * 
 * @param {string} UserId 
 * @param {"pull"|"push"} action 
 */
const MaintainAdminRoleArray = async (UserId, action) => {
    const [AdminArrayDoc] = await Read("PendingAdminRoles", undefined, undefined, 1);
    switch (action) {
        case "push": {
            return await Update("PendingAdminRoles", { "AdminArray": UserId }, AdminArrayDoc.DocId, ["$push"], false);
        }
        case "pull": {
            return await Update("PendingAdminRoles", { "AdminArray": UserId }, AdminArrayDoc.DocId, ["$pull"], false);
        }
        default: {
            return;
        }
    }
}

/**
 * 
 * @param {string} OTPId 
 * @returns {Promise<OTPData>}
 */
const ReadOneFromOTP = async (OTPId) => {
    return await Read("OTP", OTPId);
}
/** 
 * 
 * @param {object} CurrentUser 
 * @returns 
 */
const TokenData = async (CurrentUser) => {
    const { Token, RefreshToken } = await GenerateToken(CurrentUser);           //fn in auth

    return {
        CurrentUser,
        Token,
        RefreshToken
    };
}

export {
    ModelLogin, RefreshToken, GenerateToken,
    VerifyOTP, SendRegisterOTP, TokenData,
    SendPasswordOTP, ReadOneFromOTP, CheckOTP,
    ReadRefreshTokens, UpdateRefreshToken,
    MaintainAdminRoleArray, ReadAdminRoleArray
};

