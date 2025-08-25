import dataHandling from './functions.js'

const MAX_CONNECTIONLIST_SIZE = 3;


/**
 * @typedef {object} UserExtendedPropertiesData
 * @property {string} UserId
 * @property {"ConnectionsList"} Type
 * @property {object} Content
 * @property {string} DocId
 * @property {number} CreatedIndex
 */

/**
 * @typedef {object} ConnectionsListData
 * @property {string} UserId
 * @property {"ConnectionsList"} Type
 * @property {ConnectionListObject} Content
 */

/**
 * @typedef {object} ConnectionListObject
 * @property {string[]} ConnectionsList
 */

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<UserExtendedPropertiesData>>} Returns UserExtendedPropertiesData
 */
const ReadUserExtendedProperties = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('UserExtendedProperties', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<UserExtendedPropertiesData>}
 */
const ReadOneFromUserExtendedProperties = async (DocId) => {
    return dataHandling.Read('UserExtendedProperties', DocId);
}

/**
 * 
 * @param {UserExtendedPropertiesData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateUserExtendedProperties = async (data, DocId) => {
    return dataHandling.Update('UserExtendedProperties', data, DocId);
}


/**
 * 
 * @param {UserExtendedPropertiesData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateUserExtendedProperties = async (data, DocId = undefined) => {
    return dataHandling.Create('UserExtendedProperties', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveUserExtendedProperties = async (DocId) => {
    return dataHandling.Delete('UserExtendedProperties', DocId);
}

/**
 * 
 * @param {object} data 
 * @param {string} DocId 
 */
const PushOnceInUserExtendedProperties = async (data, DocId) => {   // Using AddToSet doesnt push duplicates to array
    return dataHandling.Update("UserExtendedProperties", data, DocId, ["$addToSet"], false)
}

/**
 * 
 * @param {object} data 
 * @param {string} DocId 
 */
const PullUserExtendedProperties = async (data, DocId) => {
    return dataHandling.Update("UserExtendedProperties", data, DocId, ["$pull"], false)
}


/**
 * 
 * @param {object} Data 
 * @param {string} Data.UserId
 * @param {"ConnectionsList"} Data.Type
 * @param {ConnectionListObject} Data.Content
 * @returns 
 */
const UserExtendedPropertiesInit = (Data) => {
    return {
        ...Data
    }
}

export {
    ReadUserExtendedProperties,
    ReadOneFromUserExtendedProperties,
    UpdateUserExtendedProperties,
    CreateUserExtendedProperties,
    RemoveUserExtendedProperties,
    MAX_CONNECTIONLIST_SIZE,
    PushOnceInUserExtendedProperties,
    UserExtendedPropertiesInit,
    PullUserExtendedProperties
}