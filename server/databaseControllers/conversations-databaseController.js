import dataHandling from './functions.js'

/**@typedef {import('./users-databaseController.js').UserData} UserData*/
/**
 * @typedef {import('./messages-databaseController.js').MessageData} MessageData
 */

/**
 * @typedef {object} ConversationData
 * @property {[UserData,UserData]} UserDetails
 * @property {[string,string]} ParticipantIds
 * @property {MessageData} LatestMessage
 * @property {boolean} OneMessageSent
 * @property {string} DocId
 */




/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ConversationData>>} Returns ConversationData
 */
const ReadConversations = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Conversations', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ConversationData>}
 */
const ReadOneFromConversations = async (DocId) => {
    return dataHandling.Read('Conversations', DocId);
}

/**
 * 
 * @param {ConversationData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateConversations = async (data, DocId) => {
    return dataHandling.Update('Conversations', data, DocId);
}


/**
 * 
 * @param {ConversationData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateConversations = async (data, DocId = undefined) => {
    return dataHandling.Create('Conversations', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveConversations = async (DocId) => {
    return dataHandling.Delete('Conversations', DocId);
}

const UpdateAndIncrementConversations = async (UpdateData, IncrementData, DocId) => {
    return dataHandling.Update("Conversations", UpdateData, DocId, ["$set", "$inc"], true, IncrementData);
}
export {
    ReadConversations,
    ReadOneFromConversations,
    UpdateConversations,
    CreateConversations,
    RemoveConversations,
    UpdateAndIncrementConversations
}