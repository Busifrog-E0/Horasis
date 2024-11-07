import dataHandling from './functions.js'

/**
 * @typedef {import('./users-databaseController.js').UserData} UserData
 */
/**
 * @typedef {import('./members-databaseController.js').PermissionData} PermissionData
 */


/**
 * @typedef {object} PodcastData
 * @property {string} PodcastName
 * @property {string} Brief
 * @property {string} OrganiserId
 * @property {UserData} UserDetails
 * @property {string} Description
 * @property {string} DocId
 * @property {"Public"|"Private"} Privacy
 * @property {number} CreatedIndex
 * @property {string} CoverPicture
 * @property {number} NoOfMembers
 * @property {PermissionData} MemberPermissions
 * @property {object[]} Languages
 * @property {string[]} Tags
 */



/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @returns {Promise<Array<PodcastData>>} Returns PodcastData
 */
const ReadPodcasts = async (Where, NextIndex, Limit, orderBy) => {
    return dataHandling.Read('Podcasts', undefined, NextIndex, Limit, Where, orderBy);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<PodcastData>}
 */
const ReadOneFromPodcasts = async (DocId) => {
    return dataHandling.Read('Podcasts', DocId);
}

/**
 * 
 * @param {PodcastData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdatePodcasts = async (data, DocId) => {
    return dataHandling.Update('Podcasts', data, DocId);
}


/**
 * 
 * @param {PodcastData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreatePodcasts = async (data, DocId = undefined) => {
    return dataHandling.Create('Podcasts', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemovePodcasts = async (DocId) => {
    return dataHandling.Delete('Podcasts', DocId);
}

const AggregatePodcasts = async (AggregateArray, NextIndex, Limit, OrderBy) => {
    return dataHandling.Aggregate('Podcasts', AggregateArray, NextIndex, Limit, OrderBy);
}

const IncrementPodcasts = async (data, DocId) => {
    return dataHandling.Update("Podcasts", data, DocId, ["$inc"], false);
}

const PullFromManyPodcasts = async (data, where = {}, updateOptions = {}) => {
    return dataHandling.UpdateMany('Podcasts', data, where, ["$pull"], updateOptions);
}

export {
    ReadPodcasts,
    ReadOneFromPodcasts,
    UpdatePodcasts,
    CreatePodcasts,
    RemovePodcasts,
    AggregatePodcasts,
    IncrementPodcasts,
    PullFromManyPodcasts
}