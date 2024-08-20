import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */

/**
 * @typedef {object} ArticleData
 * @property {string} ArticleName
 * @property {string} Description
 * @property {string} DocId
 * @property {string} CoverPicture
 * @property {number} CreatedIndex
 * @property {string} AuthorId
 * @property {number} NoOfLikes
 * @property {number} NoOfComments
 * @property {UserData} UserDetails
 * @property {object[]} Languages
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<ArticleData>>} Returns ArticleData
 */
const ReadArticles = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Articles', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<ArticleData>}
 */
const ReadOneFromArticles = async (DocId) => {
    return dataHandling.Read('Articles', DocId);
}

/**
 * 
 * @param {ArticleData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateArticles = async (data, DocId) => {
    return dataHandling.Update('Articles', data, DocId);
}


/**
 * 
 * @param {ArticleData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateArticles = async (data, DocId = undefined) => {
    return dataHandling.Create('Articles', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveArticles = async (DocId) => {
    return dataHandling.Delete('Articles', DocId);
}

const IncrementArticles = async (data, DocId) => {
    return dataHandling.Update("Articles", data, DocId, ["$inc"], false);
}

export {
    ReadArticles,
    ReadOneFromArticles,
    UpdateArticles,
    CreateArticles,
    RemoveArticles,
    IncrementArticles
}