import dataHandling from './functions.js'

/**
 * @typedef {object} MessageData
 * @property {Array<{UserId:string,SeenIndex:number}>} SeenUsers
 * @property {string} ConversationId
 * @property {string} SenderId
 * @property {string} Content
 * @property {number} CreatedIndex
 * @property {string} DocId
 * 
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<MessageData>>} Returns MessageData
 */
const ReadMessages = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Messages', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<MessageData>}
 */
const ReadOneFromMessages = async (DocId) => {
    return dataHandling.Read('Messages', DocId);
}

/**
 * 
 * @param {MessageData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateMessages = async (data, DocId) => {
    return dataHandling.Update('Messages', data, DocId);
}

/**
 * 
 * @param {MessageData|object} data 
 * @param {object} filter 
 * @returns {Promise<boolean>}
 */
const UpdateManyMessage = async (filter, data, operation = ["$set"]) => {
    return dataHandling.UpdateMany("Messages", data, filter, operation);
}

/**
 * 
 * @param {MessageData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateMessages = async (data, DocId = undefined) => {
    return dataHandling.Create('Messages', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveMessages = async (DocId) => {
    return dataHandling.Delete('Messages', DocId);
}

/**
 * 
 * @param {object} Where 
 * @returns {Promise<number>}
 */
const GetMessagesCount = async (Where = {}) => {
    return dataHandling.ReadCount('Messages', Where);
}

export {
    ReadMessages,
    ReadOneFromMessages,
    UpdateMessages,
    UpdateManyMessage,
    CreateMessages,
    RemoveMessages,
    GetMessagesCount,
}