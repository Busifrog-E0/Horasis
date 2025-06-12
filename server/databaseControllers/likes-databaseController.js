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
 * @property {string} ParentId
 * @property {"Feed"|"Discussion"|"Event"|"Podcast"|"Article"} ParentType
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
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {undefined|object} Session 
 * @returns {Promise<Array<LikeData>>} Returns LikeData
 */
const TransactionalReadLikes = async (Where, NextIndex, Limit, orderBy, Session) => {
    return dataHandling.TransactionalRead('Likes', undefined, NextIndex, Limit, Where, orderBy, Session);
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
 * @param {LikeData|object} data
 * @param {string|undefined} DocId 
 * @param {object|undefined} Session 
 * @returns {Promise<string>}
 */
const TransactionalCreateLikes = async (data, DocId = undefined, Session) => {
    return dataHandling.TransactionalCreate('Likes', data, DocId, undefined, Session);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveLikes = async (DocId) => {
    return dataHandling.Delete('Likes', DocId);
}


const CountLikes = async (where) => {
    return dataHandling.ReadCount("Likes", where)
}

export {
    ReadLikes,
    TransactionalReadLikes,
    ReadOneFromLikes,
    UpdateLikes,
    CreateLikes,
    TransactionalCreateLikes,
    RemoveLikes,
    CountLikes
}