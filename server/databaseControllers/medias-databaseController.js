import dataHandling from './functions.js'

/**
 * @typedef {object} MediaData
 * @property {string} FileUrl
 * @property {string} Type
 * @property {string} DocId
 * @property {string} UserId
 * @property {number} CreatedIndex
 * @property {number} EntityId
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<MediaData>>} Returns MediaData
 */
const ReadMedias = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Medias', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<MediaData>}
 */
const ReadOneFromMedias = async (DocId) => {
    return dataHandling.Read('Medias', DocId);
}

/**
 * 
 * @param {MediaData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateMedias = async (data, DocId) => {
    return dataHandling.Update('Medias', data, DocId);
}


/**
 * 
 * @param {MediaData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateMedias = async (data, DocId = undefined) => {
    return dataHandling.Create('Medias', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveMedias = async (DocId) => {
    return dataHandling.Delete('Medias', DocId);
}


export {
    ReadMedias,
    ReadOneFromMedias,
    UpdateMedias,
    CreateMedias,
    RemoveMedias
}