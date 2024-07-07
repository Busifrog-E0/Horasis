import dataHandling from './functions.js'

/**
 * @typedef {object} ConnectionData
 * @property {[string,string]} UserIds
 * @property {string} SenderId
 * @property {string} ReceiverId
 * @property {number} CreatedIndex
 * @property {number} AcceptedIndex
 * @property {"Pending"|"Connected"} Status
 * @property {string} DocId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ConnectionData>>} Returns ConnectionData
 */
const ReadConnections = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Connections', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ConnectionData>}
 */
const ReadOneFromConnections = async (DocId) => {
    return dataHandling.Read('Connections', DocId);
}

/**
 * 
 * @param {ConnectionData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateConnections = async (data, DocId) => {
    return dataHandling.Update('Connections', data, DocId);
}


/**
 * 
 * @param {ConnectionData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateConnections = async (data, DocId = undefined) => {
    return dataHandling.Create('Connections', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveConnections = async (DocId) => {
    return dataHandling.Delete('Connections', DocId);
}


export {
    ReadConnections,
    ReadOneFromConnections,
    UpdateConnections,
    CreateConnections,
    RemoveConnections
}