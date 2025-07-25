import dataHandling from './functions.js'

/**@typedef {import('./users-databaseController.js').UserData} UserData*/

/**
 * @typedef {object} FollowData
 * @property {string} FollowerId
 * @property {string} FolloweeId
 * @property {[UserData,UserData]} UserDetails
 * @property {string} DocId
 * @property {number} CreatedIndex
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<FollowData>>} Returns FollowData
 */
const ReadFollows = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Follows', undefined, NextIndex, Limit, Where, orderBy);
}


/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {undefined|object} Session 
 * @returns {Promise<Array<FollowData>>} Returns FollowData
 */
const TransactionalReadFollows = async (Where, NextIndex, Limit, orderBy, Session) => {
    return dataHandling.TransactionalRead('Follows', undefined, NextIndex, Limit, Where, orderBy, Session);
}


/**
 * 
 * @param {string} DocId 
 * @returns {Promise<FollowData>}
 */
const ReadOneFromFollows = async (DocId) => {
    return dataHandling.Read('Follows', DocId);
}

/**
 * 
 * @param {FollowData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateFollows = async (data, DocId) => {
    return dataHandling.Update('Follows', data, DocId);
}


/**
 * 
 * @param {FollowData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateFollows = async (data, DocId = undefined) => {
    return dataHandling.Create('Follows', data, DocId);
}


/**
 * 
 * @param {FollowData|object} data
 * @param {string|undefined} DocId 
 * @param {object|undefined} Session 
 * @returns {Promise<string>}
 */
const TransactionalCreateFollows = async (data, DocId = undefined, Session) => {
    return dataHandling.TransactionalCreate('Follows', data, DocId, undefined, Session);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveFollows = async (DocId) => {
    return dataHandling.Delete('Follows', DocId);
}

const GetFollowCount = async (Where = {}) => {
    return dataHandling.ReadCount('Follows', Where);
}

const UpdateManyFollows = async (data, where = {}, updateOptions = {}) => {
    return dataHandling.UpdateMany('Follows', data, where, ["$set"], updateOptions);
}

export {
    ReadFollows,
    TransactionalReadFollows,
    ReadOneFromFollows,
    UpdateFollows,
    CreateFollows,
    TransactionalCreateFollows,
    RemoveFollows,
    GetFollowCount,
    UpdateManyFollows
}