import dataHandling from './functions.js'

/**
 * @typedef {object} TagData
 * @property {string} TagName
 * @property {string} DocId
 * @property {number} CreatedIndex
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<TagData>>} Returns TagData
 */
const ReadTags = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Tags', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<TagData>}
 */
const ReadOneFromTags = async (DocId) => {
    return dataHandling.Read('Tags', DocId);
}

/**
 * 
 * @param {TagData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateTags = async (data, DocId) => {
    return dataHandling.Update('Tags', data, DocId);
}


/**
 * 
 * @param {TagData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateTags = async (data, DocId = undefined) => {
    return dataHandling.Create('Tags', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveTags = async (DocId) => {
    return dataHandling.Delete('Tags', DocId);
}


export {
    ReadTags,
    ReadOneFromTags,
    UpdateTags,
    CreateTags,
    RemoveTags
}