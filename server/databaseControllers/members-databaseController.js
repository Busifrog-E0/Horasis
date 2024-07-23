import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} PermissionData
 * @property {boolean} IsAdmin
 * @property {boolean} CanInviteOthers
 * @property {boolean} CanPostActivity
 * @property {boolean} CanUploadPhoto
 * @property {boolean} CanCreateAlbum
 * @property {boolean} CanUploadVideo

 * 
 */

/**
 * @typedef {object} MemberData
 * @property {string} EntityId
 * @property {string} MemberId
 * @property {UserData} UserDetails
 * @property {"Invited"|"Accepted"} Status
 * @property {string} DocId
 * @property {"Discussion"|"Event"} Type
 * @property {number} CreatedIndex
 * @property {PermissionData} Permissions
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<MemberData>>} Returns MemberData
 */
const ReadMembers = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Members', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<MemberData>}
 */
const ReadOneFromMembers = async (DocId) => {
    return dataHandling.Read('Members', DocId);
}

/**
 * 
 * @param {MemberData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateMembers = async (data, DocId) => {
    return dataHandling.Update('Members', data, DocId);
}


/**
 * 
 * @param {MemberData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateMembers = async (data, DocId = undefined) => {
    return dataHandling.Create('Members', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveMembers = async (DocId) => {
    return dataHandling.Delete('Members', DocId);
}


export {
    ReadMembers,
    ReadOneFromMembers,
    UpdateMembers,
    CreateMembers,
    RemoveMembers
}