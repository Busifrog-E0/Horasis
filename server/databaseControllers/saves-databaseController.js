import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {import('./activities-databaseController.js').ActivityData} ActivityData
 */

/**
 * @typedef {object} SaveData
 * @property {string} ActivityId
 * @property {string} UserId
 * @property {UserData} UserDetails
 * @property {ActivityData} ActivityDetails
 * @property {number} CreatedIndex
 * @property {string} DocId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<SaveData>>} Returns SaveData
 */
const ReadSaves = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Saves', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<SaveData>}
 */
const ReadOneFromSaves = async (DocId) => {
    return dataHandling.Read('Saves', DocId);
}

/**
 * 
 * @param {SaveData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateSaves = async (data, DocId) => {
    return dataHandling.Update('Saves', data, DocId);
}


/**
 * 
 * @param {SaveData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateSaves = async (data, DocId = undefined) => {
    return dataHandling.Create('Saves', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveSaves = async (DocId) => {
    return dataHandling.Delete('Saves', DocId);
}


export {
    ReadSaves,
    ReadOneFromSaves,
    UpdateSaves,
    CreateSaves,
    RemoveSaves
}