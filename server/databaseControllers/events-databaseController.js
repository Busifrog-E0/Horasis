import dataHandling from './functions.js'

/**
 * @typedef {import('./members-databaseController.js').PermissionData} PermissionData
 */

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */
/**
 * @typedef {object} AgendaData
 * @property {string} Name
 * @property {string} Description
 * @property {number} StartTime
 * @property {number} EndTime
 */

/**
 * @typedef {object} SpeakerData
 * @property {string} SpeakerId
 * @property {UserData} UserDetails
 */

/**
 * @typedef {object} EventData
 * @property {string} OrganiserId
 * @property {string} EventName
 * @property {string} Description
 * @property {number} Date
 * @property {number} StartTime
 * @property {number} EndTime
 * @property {AgendaData[]} Agenda
 * @property {"Public"|"Private"} Privacy
 * @property {"Virtual"|"Physical"} Type
 * @property {string} Country
 * @property {number} NoOfMembers
 * @property {string} DisplayPicture
 * @property {string} CoverPicture
 * @property {boolean} HasDiscussion
 * @property {SpeakerData[]} Speakers
 * @property {string} DocId
 * @property {number} CreatedIndex
 * @property {PermissionData} MemberPermissions
 * @property {object[]} Languages
 * @property {string[]} Tags
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<EventData>>} Returns EventData
 */
const ReadEvents = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Events', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<EventData>}
 */
const ReadOneFromEvents = async (DocId) => {
    return dataHandling.Read('Events', DocId);
}

/**
 * 
 * @param {EventData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateEvents = async (data, DocId) => {
    return dataHandling.Update('Events', data, DocId);
}


/**
 * 
 * @param {EventData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateEvents = async (data, DocId = undefined) => {
    return dataHandling.Create('Events', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveEvents = async (DocId) => {
    return dataHandling.Delete('Events', DocId);
}

const AggregateEvents = (AggregateArray, NextIndex, Limit, OrderBy) => {
    return dataHandling.Aggregate('Events', AggregateArray, NextIndex, Limit, OrderBy);
}

const IncrementEvents = async (data, DocId) => {
    return dataHandling.Update("Events", data, DocId, ["$inc"], false);
}

const PushArrayEvents = async (data, DocId) => {
    return dataHandling.Update("Events", data, DocId, ["$push"], false);
}

const PullArrayEvents = async (data, DocId) => {
    return dataHandling.Update("Events", data, DocId, ["$pull"], false);
}

const CountEvents = async (where) => {
    return dataHandling.ReadCount('Events', where);
}


export {
    ReadEvents,
    ReadOneFromEvents,
    UpdateEvents,
    CreateEvents,
    RemoveEvents,
    IncrementEvents,
    AggregateEvents,
    PushArrayEvents,
    PullArrayEvents,
    CountEvents
}