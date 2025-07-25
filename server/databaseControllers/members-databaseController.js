import { RemoveNotificationForMember, TransactionalRemoveNotificationForMember } from '../controllers/notifications-controller.js';
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
 * @property {"Invited"|"Accepted"|"Requested"} MembershipStatus
 * @property {string} DocId
 * @property {"Discussion"|"Event"|"Podcast"} Type
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
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {undefined|object} Session 
 * @returns {Promise<Array<MemberData>>} Returns MemberData
 */
const TransactionalReadMembers = async (Where, NextIndex, Limit, orderBy, Session) => {
    return dataHandling.TransactionalRead('Members', undefined, NextIndex, Limit, Where, orderBy, Session);
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
 * @param {string} DocId 
 * @param {undefined|object} Session 
 * @returns {Promise<MemberData>}
 */
const TransactionalReadOneFromMembers = async (DocId, Session) => {
    return dataHandling.TransactionalRead('Members', DocId, undefined, undefined, undefined, undefined, Session);
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
 * @param {MemberData|object} data
 * @param {string|undefined} DocId 
 * @param {object|undefined} Session 
 * @returns {Promise<string>}
 */
const TransactionalCreateMembers = async (data, DocId = undefined, Session) => {
    return dataHandling.TransactionalCreate('Members', data, DocId, undefined, Session);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveMembers = async (DocId) => {
    const Member = await ReadOneFromMembers(DocId);
    await RemoveNotificationForMember(Member.EntityId, Member.MemberId);
    return dataHandling.Delete('Members', DocId);
}


/**
 * 
 * @param {string} DocId 
 * @param {object|undefined} Session 
 * @returns {Promise<boolean>}
 */
const TransactionalRemoveMembers = async (DocId, Session) => {
    const Member = await TransactionalReadOneFromMembers(DocId, Session);
    await TransactionalRemoveNotificationForMember(Member.EntityId, Member.MemberId, Session);
    return dataHandling.TransactionalDelete('Members', DocId, Session);
}

/**
 * 
 * @param {object} data 
 * @param {object} where 
 * @returns 
 */
const UpdateManyMembers = async (data, where = {}, updateOptions = {}) => {
    return dataHandling.UpdateMany('Members', data, where, ["$set"], updateOptions);
}

export {
    ReadMembers,
    TransactionalReadMembers,
    ReadOneFromMembers,
    TransactionalReadOneFromMembers,
    UpdateMembers,
    CreateMembers,
    TransactionalCreateMembers,
    RemoveMembers,
    TransactionalRemoveMembers,
    UpdateManyMembers
}