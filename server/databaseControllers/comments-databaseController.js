import dataHandling from './functions.js'

/**
 * @typedef {object} CommentData
 * @property {string} Content
 * @property {string} ParentId
 * @property {string} UserId
 * @property {string} DocId
 * @property {number} NoOfReplies
 * @property {number} NoOfLikes
 * @property {{Username : string,UserId: string,FullName : string}[]} Mentions
 * @property {'Comment'|'Reply'} Type
 * @property {'Activity'|'Article'} ParentType
 * @property {'Feed'|'Discussion'|'Event'|'Podcast'|'Article'} RootParentType
 * @property {string} RootParentId
 * @property {object} Languages
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<CommentData>>} Returns CommentData
 */
const ReadComments = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Comments', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<CommentData>}
 */
const ReadOneFromComments = async (DocId) => {
    return dataHandling.Read('Comments', DocId);
}

/**
 * 
 * @param {CommentData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateComments = async (data, DocId) => {
    return dataHandling.Update('Comments', data, DocId);
}


/**
 * 
 * @param {CommentData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateComments = async (data, DocId = undefined) => {
    return dataHandling.Create('Comments', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveComments = async (DocId) => {
    return dataHandling.Delete('Comments', DocId);
}

const CommentCount = async (Where = {}) => {
    return dataHandling.ReadCount('Comments', Where);
}

const IncrementComments = async (data, DocId) => {
    return dataHandling.Update("Comments", data, DocId, ["$inc"], false);
}

export {
    ReadComments,
    ReadOneFromComments,
    UpdateComments,
    CreateComments,
    RemoveComments,
    CommentCount,
    IncrementComments
}