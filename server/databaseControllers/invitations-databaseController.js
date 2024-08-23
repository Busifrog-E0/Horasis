import dataHandling from './functions.js'

/**
 * @typedef {object} InvitationData
 * @property {string} Email
 * @property {object[]} OnCreate
 * @property {string} DocId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<InvitationData>>} Returns InvitationData
 */
const ReadInvitations = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Invitations', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<InvitationData>}
 */
const ReadOneFromInvitations = async (DocId) => {
    return dataHandling.Read('Invitations', DocId);
}

/**
 * 
 * @param {InvitationData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateInvitations = async (data, DocId) => {
    return dataHandling.Update('Invitations', data, DocId);
}


/**
 * 
 * @param {InvitationData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateInvitations = async (data, DocId = undefined) => {
    return dataHandling.Create('Invitations', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveInvitations = async (DocId) => {
    return dataHandling.Delete('Invitations', DocId);
}


export {
    ReadInvitations,
    ReadOneFromInvitations,
    UpdateInvitations,
    CreateInvitations,
    RemoveInvitations
}