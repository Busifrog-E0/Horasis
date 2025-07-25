import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} NotificationData
 * @property {string} RecipientId
 * @property {string} NotifierId
 * @property {UserData} UserDetails  //Notifier Details
 * @property {string} EntityId
 * @property {string} EntityType
 * @property {string|null} Link
 * @property {string} DocId
 * @property {boolean} HasSeen
 * @property {string} Content
 * @property {string} Type
 * @property {string} [EntityName]
 * @property {string} [Status]
 * @property {{Text : string, Link : string}[]} ContentLinks
 *
*/



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<NotificationData>>} Returns NotificationData
 */
const ReadNotifications = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Notifications', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {undefined|object} Session 
 * @returns {Promise<Array<NotificationData>>} Returns NotificationData
 */
const TransactionalReadNotifications = async (Where, NextIndex, Limit, orderBy, Session) => {
    return dataHandling.TransactionalRead('Notifications', undefined, NextIndex, Limit, Where, orderBy, Session);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<NotificationData>}
 */
const ReadOneFromNotifications = async (DocId) => {
    return dataHandling.Read('Notifications', DocId);
}

/**
 * 
 * @param {NotificationData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateNotifications = async (data, DocId) => {
    return dataHandling.Update('Notifications', data, DocId);
}

/**
 * 
 * @param {NotificationData|object} data 
 * @param {object} where 
 * @returns 
 */
const UpdateManyNotifications = async (data, where = {}) => {
    return dataHandling.UpdateMany("Notifications", data, where);
}


/**
 * 
 * @param {NotificationData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateNotifications = async (data, DocId = undefined) => {
    return dataHandling.Create('Notifications', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveNotifications = async (DocId) => {
    return dataHandling.Delete('Notifications', DocId);
}

/**
 * 
 * @param {string} DocId 
 * @param {undefined|object} Session 
 * @returns {Promise<boolean>}
 */
const TransactionalRemoveNotifications = async (DocId, Session) => {
    return dataHandling.TransactionalDelete('Notifications', DocId, Session);
}


const CountNotifications = async (where) => {
    return dataHandling.ReadCount("Notifications", where);
}

export {
    ReadNotifications,
    TransactionalReadNotifications,
    ReadOneFromNotifications,
    UpdateNotifications,
    CreateNotifications,
    RemoveNotifications,
    TransactionalRemoveNotifications,
    UpdateManyNotifications,
    CountNotifications,
}