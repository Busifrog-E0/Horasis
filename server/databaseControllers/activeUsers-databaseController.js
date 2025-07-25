import dataHandling from './functions.js'

/**
 * @typedef {object} ActiveUserData
 * @property {string} UserId
 * @property {number} Date

 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ActiveUserData>>} Returns ActiveUserData
 */
const ReadActiveUsers = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('ActiveUsers', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ActiveUserData>}
 */
const ReadOneFromActiveUsers = async (DocId) => {
    return dataHandling.Read('ActiveUsers', DocId);
}

/**
 * 
 * @param {ActiveUserData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateActiveUsers = async (data, DocId) => {
    return dataHandling.Update('ActiveUsers', data, DocId);
}


/**
 * 
 * @param {ActiveUserData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateActiveUsers = async (data, DocId = undefined) => {
    return dataHandling.Create('ActiveUsers', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveActiveUsers = async (DocId) => {
    return dataHandling.Delete('ActiveUsers', DocId);
}

/**
 * 
 * @param {object} where 
 * @returns 
 */
const CountActiveUsers = async (where = {}) => {
    return dataHandling.DistinctValues("ActiveUsers", "UserId", where)
}

export {
    ReadActiveUsers,
    ReadOneFromActiveUsers,
    UpdateActiveUsers,
    CreateActiveUsers,
    RemoveActiveUsers,
    CountActiveUsers
}