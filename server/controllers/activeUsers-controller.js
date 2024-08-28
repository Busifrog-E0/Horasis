import e from 'express';

import { ReadOneFromActiveUsers, ReadActiveUsers, UpdateActiveUsers, CreateActiveUsers, RemoveActiveUsers, } from './../databaseControllers/activeUsers-databaseController.js';
import moment from 'moment';
/**
 * @typedef {import('./../databaseControllers/activeUsers-databaseController.js').ActiveUserData} ActiveUserData 
 */

const PostActiveUsers = async (UserId) => {
    const CurrentDate = moment().startOf('day').valueOf();
    const [checkActiveUser] = await ReadActiveUsers({ UserId, Data: CurrentDate }, undefined, 1, undefined);
    if (!checkActiveUser) {
        await CreateActiveUsers({ UserId, Date: CurrentDate });
    }
    return;
}



export {
    PostActiveUsers
}