import dataHandling from './functions.js'

/**
 * @typedef {import('./members-databaseController.js').PermissionData} PermissionData
 */

/**
 * @typedef {object} AgendaData
 * @property {string} Name
 * @property {string} Description
 * @property {string} Date
 * @property {string} StartTime
 * @property {string} EndTime
 */

/**
 * @typedef {object} EventData
 * @property {string} OrganiserId
 * @property {string} EventName
 * @property {string} Description
 * @property {string} Date
 * @property {string} StartTime
 * @property {string} EndTime
 * @property {AgendaData[]} Agenda
 * @property {"Public"|"Private"} Privacy
 * @property {"Virtual"|"Physical"} Type
 * @property {string} Country
 * @property {number} NoOfMembers
 * @property {string} DisplayPicture
 * @property {string} CoverPicture
 * @property {string} DocId
 * @property {number} CreatedIndex
 * @property {Omit<PermissionData, 'IsAdmin'>} MemberPermissions
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


export {
    ReadEvents,
    ReadOneFromEvents,
    UpdateEvents,
    CreateEvents,
    RemoveEvents,
    IncrementEvents,
    AggregateEvents
}