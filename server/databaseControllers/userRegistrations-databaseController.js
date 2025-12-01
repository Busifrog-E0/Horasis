import dataHandling from './functions.js'

/**
 * @typedef {object} UserRegistrationData
 * @property {import('./users-databaseController.js').UserData} [UserData]
 * @property {boolean} AlreadyUsed
 * @property {string} RegistrationCode
 * @property {string} RegistrationLink
 * @property {string} DocId
 * @property {number} CreatedIndex
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<UserRegistrationData>>} Returns UserRegistrationData
 */
const ReadUserRegistrations = async (Where, NextIndex, Limit, orderBy) => {
    // @ts-ignore
    return dataHandling.Read('UserRegistrations', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<UserRegistrationData>}
 */
const ReadOneFromUserRegistrations = async (DocId) => {
    // @ts-ignore
    return dataHandling.Read('UserRegistrations', DocId);
}

/**
 * 
 * @param {UserRegistrationData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateUserRegistrations = async (data, DocId) => {
    return dataHandling.Update('UserRegistrations', data, DocId);
}


/**
 * 
 * @param {UserRegistrationData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateUserRegistrations = async (data, DocId = undefined) => {
    return dataHandling.Create('UserRegistrations', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveUserRegistrations = async (DocId) => {
    return dataHandling.Delete('UserRegistrations', DocId);
}


export {
    ReadUserRegistrations,
    ReadOneFromUserRegistrations,
    UpdateUserRegistrations,
    CreateUserRegistrations,
    RemoveUserRegistrations
}