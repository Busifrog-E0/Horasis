import dataHandling from "./functions.js";

/**
 * @typedef {object} PostData
 * @property {string} Content
 * @property {string[]} MediaFiles
 * @property {string[]} Documents
 * @property {string[]} Mentions
 * @property {string[]} Likes
 * @property {string[]} Attatchments
 */

/**
 *
 * @param {undefined|object} Where
 * @param {undefined|string} NextIndex
 * @param {undefined|number} Limit
 * @param {undefined|object} orderBy
 * @returns {Promise<Array<PostData>>} Returns PostData
 */
const ReadPosts = async (Where, NextIndex, Limit, orderBy) => {
  return dataHandling.Read("Posts", undefined, NextIndex, Limit, Where, orderBy);
};

/**
 *
 * @param {string} DocId
 * @returns {Promise<PostData>}
 */
const ReadOneFromPosts = async (DocId) => {
  return dataHandling.Read("Posts", DocId);
};

/**
 *
 * @param {PostData|object} data
 * @param {string} DocId
 * @returns {Promise<boolean>}
 */
const UpdatePosts = async (data, DocId) => {
  return dataHandling.Update("Posts", data, DocId);
};

/**
 *
 * @param {PostData|object} data
 * @param {string|undefined} DocId
 * @returns {Promise<string>}
 */
const CreatePosts = async (data, DocId = undefined) => {
  return dataHandling.Create("Posts", data, DocId);
};

/**
 *
 * @param {string} DocId
 * @returns {Promise<boolean>}
 */
const RemovePosts = async (DocId) => {
  return dataHandling.Delete("Posts", DocId);
};

export { ReadPosts, ReadOneFromPosts, UpdatePosts, CreatePosts, RemovePosts };
