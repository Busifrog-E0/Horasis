import dataHandling from './functions.js'



/**
 * @typedef {object} UserData
 * @property {string} FullName
 * @property {string} Username  
 * @property {string} Email
 * @property {string} DocId
 * @property {string} Password
 * @property {string} Country
 * @property {string} City
 * @property {string} JobTitle
 * @property {string} Industry
 * @property {string} CompanyName
 * @property {string} About
 * @property {string} ProfilePicture
 * @property {string} CoverPicture
 * @property {string} LastActive
 * @property {string[]} Interests
 * @property {["User"]|["Admin","User"]} Roles
 */

/**
 * @typedef {object} OtherUserData
 * @property {string} ConnectionStatus
 * @property {boolean} IsFollowed
 * @property {boolean} IsFollowing
 * @property {number} FollowIndex
 * @property {number} FollowingIndex
 * @property {number} FollowedIndex
 * @property {number} ConnectionIndex
 */

/**
 * 
 * @param {undefined|object} Where 
 * @param {undefined|string} NextIndex 
 * @param {undefined|number} Limit 
 * @param {undefined|object} orderBy 
 * @param {boolean} RemovePassword
 * @returns {Promise<Array<UserData>>} Returns UserData
 */
const ReadUsers = async (Where, NextIndex, Limit, orderBy, RemovePassword = true) => {
    /**@type {Array<UserData>} */
    let UserDataArray = await dataHandling.Read('Users', undefined, NextIndex, Limit, Where, orderBy);
    if (RemovePassword) {
        UserDataArray = UserDataArray.map(data => {
            // @ts-ignore
            delete data.Password;
            return data;
        });
    }
    return UserDataArray;
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<UserData>}
 */
const ReadOneFromUsers = async (DocId, RemovePassword = true) => {
    /**@type {UserData} */
    const UserData = await dataHandling.Read('Users', DocId);
    if (RemovePassword) {
        // @ts-ignore
        delete UserData.Password;
    }
    return UserData;
}

/**
 * 
 * @param {UserData|object} data
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const UpdateUsers = async (data, DocId) => {
    return dataHandling.Update('Users', data, DocId);
}


/**
 * 
 * @param {UserData|object} data
 * @param {string|undefined} DocId 
 * @returns {Promise<string>}
 */
const CreateUsers = async (data, DocId = undefined) => {
    return dataHandling.Create('Users', data, DocId);
}

/**
 * 
 * @param {string} DocId 
 * @returns {Promise<boolean>}
 */
const RemoveUsers = async (DocId) => {
    return dataHandling.Delete('Users', DocId);
}

const CountUsers = async (where) => {
    return dataHandling.ReadCount('Users', where);
}

/**
 * 
 * @param {object} AggregateArray 
 * @param {string|undefined} NextId 
 * @param {number} Limit 
 * @param {object|undefined} OrderBy 
 * @returns 
 */
const AggregateUsers = async (AggregateArray, NextId, Limit, OrderBy) => {
    return dataHandling.Aggregate('Users', AggregateArray, NextId, Limit, OrderBy);
}

const UpdateManyUsers = async (data, where = {}, updateOptions = {}) => {
    return dataHandling.UpdateMany('Users', data, where, ["$set"], updateOptions);
}


export {
    ReadUsers,
    ReadOneFromUsers,
    UpdateUsers,
    CreateUsers,
    RemoveUsers,
    CountUsers,
    AggregateUsers,
    UpdateManyUsers
}
