import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} DiscussionData
 * @property {string} DiscussionName
 * @property {string} Brief
 * @property {string} OrganiserId
 * @property {UserData} UserDetails
 * @property {string} Description
 * @property {string} DocId
 * @property {string} Privacy
 * @property {number} CreatedIndex
 * @property {string} CoverPicture
 * @property {number} NoOfMembers
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<DiscussionData>>} Returns DiscussionData
 */
const ReadDiscussions = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Discussions', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<DiscussionData>}
 */
const ReadOneFromDiscussions = async (DocId) => {
    return dataHandling.Read('Discussions', DocId);
}

/**
 * 
 * @param {DiscussionData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateDiscussions = async (data, DocId) => {
    return dataHandling.Update('Discussions', data, DocId);
}


/**
 * 
 * @param {DiscussionData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateDiscussions = async (data, DocId = undefined) => {
    return dataHandling.Create('Discussions', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveDiscussions = async (DocId) => {
    return dataHandling.Delete('Discussions', DocId);
}


export {
    ReadDiscussions,
    ReadOneFromDiscussions,
    UpdateDiscussions,
    CreateDiscussions,
    RemoveDiscussions,
}