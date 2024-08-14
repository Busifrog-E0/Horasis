import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */
/**
 * @typedef {object} LikeData
 * @property {string} EntityId
 * @property {string} UserId
 * @property {UserData} UserDetails
 * @property {number} CreatedIndex
 * @property {string} DocId
 * @property {'Activity'|'Comment'|'Article'} Type
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<LikeData>>} Returns LikeData
 */
const ReadLikes = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Likes', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<LikeData>}
 */
const ReadOneFromLikes = async (DocId) => {
    return dataHandling.Read('Likes', DocId);
}

/**
 * 
 * @param {LikeData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateLikes = async (data, DocId) => {
    return dataHandling.Update('Likes', data, DocId);
}


/**
 * 
 * @param {LikeData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateLikes = async (data, DocId = undefined) => {
    return dataHandling.Create('Likes', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveLikes = async (DocId) => {
    return dataHandling.Delete('Likes', DocId);
}


export {
    ReadLikes,
    ReadOneFromLikes,
    UpdateLikes,
    CreateLikes,
    RemoveLikes
}