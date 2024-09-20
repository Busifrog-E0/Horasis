import dataHandling from './functions.js'

/**
 * @typedef {object} ActivityExtendedPropertiesData
 * @property {string} ActivityId
 * @property {string} UserId
 * @property {"ConnectionsList"} Type
 * @property {string} DocId
 * @property {object} Content
 * @property {number} CreatedIndex
 */

/**
 * @typedef {object} ConnectionsListObject
 * @property {string[]} ConnectionsList
 */

/**
 *@typedef {object} ConnectionsListData
 * @property {string} ActivityId 
 * @property {"ConnectionsList"} Type
 * @property {string} DocId
 * @property {ConnectionsListObject} Content
 * @property {number} CreatedIndex
 */

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ActivityExtendedPropertiesData>>} Returns ActivityExtendedPropertiesData
 */
const ReadActivityExtendedProperties = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('ActivityExtendedProperties', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ActivityExtendedPropertiesData>}
 */
const ReadOneFromActivityExtendedProperties = async (DocId) => {
    return dataHandling.Read('ActivityExtendedProperties', DocId);
}

/**
 * 
 * @param {ActivityExtendedPropertiesData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateActivityExtendedProperties = async (data, DocId) => {
    return dataHandling.Update('ActivityExtendedProperties', data, DocId);
}


/**
 * 
 * @param {ActivityExtendedPropertiesData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateActivityExtendedProperties = async (data, DocId = undefined) => {
    return dataHandling.Create('ActivityExtendedProperties', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveActivityExtendedProperties = async (DocId) => {
    return dataHandling.Delete('ActivityExtendedProperties', DocId);
}


/**
 * 
 * @param {object} data 
 * @param {object} where 
 */
const PushOnceInManyActivityExtendedProperties = async (data, where = {}) => {   // Using AddToSet doesnt push duplicates to array
    return dataHandling.UpdateMany("ActivityExtendedProperties", data, where, ["$addToSet"])
}

/**
 * 
 * @param {object} data 
 * @param {object} where  
 */
const PullManyActivityExtendedProperties = async (data, where = {}) => {
    return dataHandling.UpdateMany("ActivityExtendedProperties", data, where, ["$pull"])
}


/**
 * 
 * @param {object} Data 
 * @param {string} Data.ActivityId
 * @param {string} Data.UserId
 * @param {"ConnectionsList"} Data.Type
 * @param {ConnectionsListObject} Data.Content
 * @param {string} Data.Index
 * @param {number} Data.CreatedIndex
 * @returns 
 */
const ActivityExtendedPropertiesInit = (Data) => {
    return {
        ...Data
    }
}

export {
    ReadActivityExtendedProperties,
    ReadOneFromActivityExtendedProperties,
    UpdateActivityExtendedProperties,
    CreateActivityExtendedProperties,
    RemoveActivityExtendedProperties,
    PushOnceInManyActivityExtendedProperties,
    PullManyActivityExtendedProperties,
    ActivityExtendedPropertiesInit
}