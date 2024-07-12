import dataHandling from "./functions.js";

/**
 * @typedef {object} ActivityData
 * @property {string} Content
 * @property {string} UserId
 * @property {string[]} MediaFiles
 * @property {string[]} Documents
 * @property {string[]} Mentions
 * @property {string[]} LikedIds
 * @property {string[]} Attachments
 * @property {number} NoOfLikes
 * @property {string} DocId
 * @property {'Feed'|'Event'|'Discussion'} Type
 * @property {string} ParentId
 */

/**
 *
 * @param {undefined|object} Where
 * @param {undefined|string} NextIndex
 * @param {undefined|number} Limit
 * @param {undefined|object} orderBy
 * @returns {Promise<Array<ActivityData>>} Returns ActivityData
 */
const ReadActivities = async (Where, NextIndex, Limit, orderBy) => {
  return dataHandling.Read("Activities", undefined, NextIndex, Limit, Where, orderBy);
};

/**
 *
 * @param {string} DocId
 * @returns {Promise<ActivityData>}
 */
const ReadOneFromActivities = async (DocId) => {
  return dataHandling.Read("Activities", DocId);
};

/**
 *
 * @param {ActivityData|object} data
 * @param {string} DocId
 * @returns {Promise<boolean>}
 */
const UpdateActivities = async (data, DocId) => {
  return dataHandling.Update("Activities", data, DocId);
};

/**
 *
 * @param {ActivityData|object} data
 * @param {string|undefined} DocId
 * @returns {Promise<string>}
 */
const CreateActivities = async (data, DocId = undefined) => {
  return dataHandling.Create("Activities", data, DocId);
};

/**
 *
 * @param {string} DocId
 * @returns {Promise<boolean>}
 */
const RemoveActivities = async (DocId) => {
  return dataHandling.Delete("Activities", DocId);
};

const IncrementActivities = async (data,DocId) => {
  return dataHandling.Update("Activities", data, DocId, ["$inc"]);
}

export {
  ReadActivities, ReadOneFromActivities, UpdateActivities, CreateActivities, RemoveActivities,
  IncrementActivities
 };
