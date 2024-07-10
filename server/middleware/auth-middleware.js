import jwt from "jsonwebtoken";
import ENV from "./../Env.js";
import e from "express";

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 * @returns 
 */
const decodeIDToken = (req, res, next) => {
    // Bearer <token>>

    const authHeader = req.headers.authorization || " ";
    const token = authHeader.split(" ")[1];
    console.log(req.method, req.originalUrl);
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const user = jwt.verify(token, ENV.TOKEN_KEY);
        // @ts-ignore
        req.user = user;
        // @ts-ignore
        console.log(req.user.UserId);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    // req.user = { "UserId": "64b92fa4c71571bcf50f3d29" };
    return next();
};


/**
 * 
 * @param  {...string} Roles 
 * @returns 
 */
const ensureAuthorized = (...Roles) => (req, res, next) => {


    // @ts-ignore
    if (!Roles.includes(req.user.Role)) {
        return res.status(402).json({ 'message': 'invalid roles' });
    }
    else {
        return next();
    }
}

export {
    decodeIDToken, ensureAuthorized,
};