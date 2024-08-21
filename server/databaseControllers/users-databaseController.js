import { DeleteCache, GetCache, SetCache } from '../controllers/redis-controller.js';
import dataHandling from './functions.js'



/**
 * @typedef {object} UserData
 * @property {string} FullName
 * @property {string} Username  
 * @property {string} Email
 * @property {string} DocId
 * @property {string} Password
 * @property {string} Country
 * @property {string} City
 * @property {string} JobTitle
 * @property {string} Industry
 * @property {string} CompanyName
 * @property {string} About
 * @property {string} ProfilePicture
 * @property {string} CoverPicture
 * @property {string} LastActive
 */

/**
 * @typedef {object} OtherUserData
 * @property {string} ConnectionStatus
 * @property {boolean} IsFollowed
 * @property {boolean} IsFollowing
 * @property {number} FollowIndex
 * @property {number} FollowingIndex
 * @property {number} FollowedIndex
 * @property {number} ConnectionIndex
 */

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {boolean} RemovePassword
 * @returns {Promise<Array<UserData>>} Returns UserData
 */
const ReadUsers = async (Where, NextIndex, Limit, orderBy, RemovePassword = true) => {
    /**@type {Array<UserData>} */
    let UserDataArray = await dataHandling.Read('Users', undefined, NextIndex, Limit, Where, orderBy);
    if (RemovePassword) {
        UserDataArray = UserDataArray.map(data => {
            // @ts-ignore
            delete data.Password;
            return data;
        });
    }
    return UserDataArray;
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<UserData>}
 */
const ReadOneFromUsers = async (DocId, RemovePassword = true) => {
    const cachekey = `users:${DocId}`;
    const cachedData = await GetCache(cachekey);
    if (cachedData) {
        return cachedData;
    }
    /**@type {UserData} */
    const UserData = await dataHandling.Read('Users', DocId);
    if (RemovePassword) {
        // @ts-ignore
        delete UserData.Password;
    }
    SetCache(cachekey, UserData);
    return UserData;
}

/**
 * 
 * @param {UserData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateUsers = async (data, DocId) => {
    
    const cachekey = `users:${DocId}`;
    DeleteCache(cachekey);
    return dataHandling.Update('Users', data, DocId);
}


/**
 * 
 * @param {UserData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateUsers = async (data, DocId = undefined) => {
    return dataHandling.Create('Users', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveUsers = async (DocId) => {
    const cachekey = `users:${DocId}`;
    DeleteCache(cachekey);
    return dataHandling.Delete('Users', DocId);
}


export {
    ReadUsers,
    ReadOneFromUsers,
    UpdateUsers,
    CreateUsers,
    RemoveUsers
}
