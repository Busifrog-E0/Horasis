import dataHandling from './functions.js'

/**
 * @typedef {object} ReportData
 * @property {string} Content
 * @property {string} ReportType
 * @property {string} DocId
 * @property {string} Type
 * @property {string} UserId
 * @property {string} EntityId
 * @property {boolean} IsDeleted
 * @property {boolean} IsViewed
 * @property {number} CreatedIndex
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ReportData>>} Returns ReportData
 */
const ReadReports = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Reports', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ReportData>}
 */
const ReadOneFromReports = async (DocId) => {
    return dataHandling.Read('Reports', DocId);
}

/**
 * 
 * @param {ReportData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateReports = async (data, DocId) => {
    return dataHandling.Update('Reports', data, DocId);
}


/**
 * 
 * @param {ReportData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateReports = async (data, DocId = undefined) => {
    return dataHandling.Create('Reports', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveReports = async (DocId) => {
    return dataHandling.Delete('Reports', DocId);
}

const UpdateManyReports = async (data, where) => { 
    return dataHandling.UpdateMany('Reports', data, where);
}

export {
    ReadReports,
    ReadOneFromReports,
    UpdateReports,
    CreateReports,
    RemoveReports,
    UpdateManyReports
}