import dataHandling from './functions.js';
import ENV from "./../Env.js";
import { el } from '@faker-js/faker';

/**
 * @typedef {object} AdminData
 * @property {string} Username
 * @property {string} Password
 */


/** @returns {Promise<AdminData>} */
const GetAuthAdmin = async () => dataHandling.Read('Admin', "66e125da6970329faa0302bd");//"6465dba3d6f853951537ff18");

const UpdateAdminInfo = async (data) => {
    return dataHandling.Update("Admin", data, "66e125da6970329faa0302bd");
}

const CreateAdminForFirstTime = async () => {
    if ((await GetAuthAdmin()) !== null) {
        return dataHandling.Update("Admin", { Username: ENV.ADMIN_USERNAME, Password: ENV.ADMIN_PASSWORD }, "66e125da6970329faa0302bd");
    }
    else {
        return dataHandling.Create("Admin", { Username: ENV.ADMIN_USERNAME, Password: ENV.ADMIN_PASSWORD }, "66e125da6970329faa0302bd");
    }
}



/**
 * @typedef {object} AdminInfoData
 * @property {string} Username
 * @property {string} Password
 * @property {string} SplashImages
 */

/** @returns {Promise<AdminInfoData>} */
const GetAdminInfo = async () => dataHandling.Read('Admin', "66e125da6970329faa0302bd");//"6465dba3d6f853951537ff18");


export {
    GetAuthAdmin, UpdateAdminInfo, GetAdminInfo, CreateAdminForFirstTime,
}