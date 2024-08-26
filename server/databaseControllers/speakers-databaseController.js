import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} SpeakerData
 * @property {string} SpeakerId
 * @property {"Accepted"|"Invited"} MembershipStatus
 * @property {UserData} UserDetails
 * @property {string} DocId
 * @property {string} EventId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<SpeakerData>>} Returns SpeakerData
 */
const ReadSpeakers = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Speakers', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<SpeakerData>}
 */
const ReadOneFromSpeakers = async (DocId) => {
    return dataHandling.Read('Speakers', DocId);
}

/**
 * 
 * @param {SpeakerData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateSpeakers = async (data, DocId) => {
    return dataHandling.Update('Speakers', data, DocId);
}


/**
 * 
 * @param {SpeakerData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateSpeakers = async (data, DocId = undefined) => {
    return dataHandling.Create('Speakers', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveSpeakers = async (DocId) => {
    return dataHandling.Delete('Speakers', DocId);
}




export {
    ReadSpeakers,
    ReadOneFromSpeakers,
    UpdateSpeakers,
    CreateSpeakers,
    RemoveSpeakers
}