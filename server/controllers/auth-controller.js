import e from "express";
import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import dataHandling from '../databaseControllers/functions.js';
const { Read, Create, Delete } = dataHandling;

/**
 * @typedef {object} RefreshTokenData
 * @property {object} SignObject
 * @property {string} Token
 * @property {boolean} Valid
 * @property {string} DocId
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
            res.json(responseObject);
        } catch (error) {
            res.status(445).json(error.message);
        }
    }
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

export { ModelLogin, RefreshToken, GenerateToken };

