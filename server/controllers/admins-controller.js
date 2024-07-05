import ENV from "./../Env.js";


/**
 * @type {"Debug"|"Production"}
 */
// @ts-ignore
const ModeOfDevelopment = ENV.ModeOfDevelopment;

import e from 'express';

import { GetAdminInfo, GetAuthAdmin, UpdateAdminInfo } from '../databaseControllers/admins-databaseController.js';
import { GenerateToken } from './auth-controller.js';
/**
 * @typedef {import('../databaseControllers/admins-databaseController.js').AdminData} AdminData 
 */

/**
 * @typedef {{"Token":string,"RefreshToken":string,"CurrentUser":{Role:string,UserId : string, RegistrationStatus : string, Subscription : null}}} TokenData
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<TokenData>>}
 */
const AuthAdmin = async (req, res) => {
    // #swagger.tags = ['Admin','Auth']
    const Username = req.body.Username.trim();
    const Password = req.body.Password.trim();

    let AdminData

    if (ModeOfDevelopment === "Debug") {
        AdminData = { "Username": "Username", "Password": "Password" };
    }
    else {
        AdminData = await GetAuthAdmin();
    }

    let TokenData;
    if (AdminData.Username === Username && AdminData.Password === Password) {
        TokenData = await GenerateToken({ Role: "Admin", "UserId": "Admin" })
    }
    else {
        /* #swagger.responses[400] = {
                description: 'Fail',
                schema: "Invalid Credentials"
            } 
        */
        return res.status(400).json("Invalid Credentials")
    }

    /* #swagger.responses[200] = {
             description: 'Admin Login Data',
             schema: {$ref: '#/definitions/LoginData'}
     } 
    */

    TokenData.CurrentUser = {
        Role: "Admin",
        UserId: "Admin",
        RegistrationStatus: "",
        Subscription: null
    };

    return res.json(TokenData);

}


/**
 * 
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response<any>>}
 */
const PatchBanners = async (req, res) => {
    await UpdateAdminInfo({ Banners: req.body })
    return res.json(true);
}


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<any>>}
 */
const GetBanners = async (req, res) => {
    const Banners = (await GetAdminInfo()).Banners;
    return res.json(Banners);
}



export {
    AuthAdmin,
    PatchBanners,
    GetBanners,

}