import dataHandling from './functions.js'

/**
 * @typedef {object} EmailVerificationData
 * @property {string} Token
 * @property {string} UserId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<EmailVerificationData>>} Returns EmailVerificationData
 */
const ReadEmailVerifications = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('EmailVerifications', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<EmailVerificationData>}
 */
const ReadOneFromEmailVerifications = async (DocId) => {
    return dataHandling.Read('EmailVerifications', DocId);
}

/**
 * 
 * @param {EmailVerificationData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateEmailVerifications = async (data, DocId) => {
    return dataHandling.Update('EmailVerifications', data, DocId);
}


/**
 * 
 * @param {EmailVerificationData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateEmailVerifications = async (data, DocId = undefined) => {
    return dataHandling.Create('EmailVerifications', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveEmailVerifications = async (DocId) => {
    return dataHandling.Delete('EmailVerifications', DocId);
}


export {
    ReadEmailVerifications,
    ReadOneFromEmailVerifications,
    UpdateEmailVerifications,
    CreateEmailVerifications,
    RemoveEmailVerifications
}