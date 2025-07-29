import { RemoveManyActivityExtendedProperties } from "./activityExtendedProperties-databaseController.js";
import dataHandling from "./functions.js";

/**
 * @typedef {object} MentionsData
 * @property {string} UserId
 * @property {string} Username
 * @property {string} FullName 
 */

/**
 * @typedef {object} ActivityData
 * @property {string} Content
 * @property {string} UserId
 * @property {string[]} MediaFiles
 * @property {string[]} Documents
 * @property {MentionsData[]} Mentions
 * @property {string[]} LikedIds
 * @property {string[]} Attachments
 * @property {number} NoOfLikes
 * @property {number} NoOfComments
 * @property {string} DocId
 * @property {'Feed'|'Event'|'Discussion'} Type
 * @property {string} EntityId
 * @property {object} Languages
 * @property {string} OriginalLanguage
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
  await RemoveManyActivityExtendedProperties({ ActivityId: DocId });
  return dataHandling.Delete("Activities", DocId);
};

const IncrementActivities = async (data, DocId) => {
  return dataHandling.Update("Activities", data, DocId, ["$inc"], false);
}

const UpdateAndIncrementActivities = async (UpdateData, IncrementData, DocId) => {
  return dataHandling.Update("Activities", UpdateData, DocId, ["$set", "$inc"], true, IncrementData);
}

const AggregateActivities = async (AggregateArray, NextIndex, Limit, OrderBy) => {
  return dataHandling.Aggregate("Activities", AggregateArray, NextIndex, Limit, OrderBy);
}

const CountActivities = async (where) => {
  return dataHandling.ReadCountCount("Activities", where);
}

const UpdateManyActivities = async (data, where = {}) => {
  return dataHandling.UpdateMany("Activities", data, where);
}

export {
  ReadActivities, ReadOneFromActivities, UpdateActivities, CreateActivities, RemoveActivities,
  IncrementActivities, UpdateAndIncrementActivities, AggregateActivities, CountActivities,
  UpdateManyActivities
};
