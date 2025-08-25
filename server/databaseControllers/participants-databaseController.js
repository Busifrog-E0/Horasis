import dataHandling from './functions.js'
/**
 * 
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} ParticipantData
 * @property {UserData} UserDetails
 * @property {string} EventId
 * @property {string} DocId
 * @property {number} CreatedIndex
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ParticipantData>>} Returns ParticipantData
 */
const ReadParticipants = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Participants', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ParticipantData>}
 */
const ReadOneFromParticipants = async (DocId) => {
    return dataHandling.Read('Participants', DocId);
}

/**
 * 
 * @param {ParticipantData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateParticipants = async (data, DocId) => {
    return dataHandling.Update('Participants', data, DocId);
}


/**
 * 
 * @param {ParticipantData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateParticipants = async (data, DocId = undefined) => {
    return dataHandling.Create('Participants', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveParticipants = async (DocId) => {
    return dataHandling.Delete('Participants', DocId);
}


export {
    ReadParticipants,
    ReadOneFromParticipants,
    UpdateParticipants,
    CreateParticipants,
    RemoveParticipants
}