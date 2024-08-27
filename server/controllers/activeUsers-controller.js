import e from 'express';

import { ReadOneFromActiveUsers, ReadActiveUsers, UpdateActiveUsers, CreateActiveUsers, RemoveActiveUsers, } from './../databaseControllers/activeUsers-databaseController.js';
import moment from 'moment';
/**
 * @typedef {import('./../databaseControllers/activeUsers-databaseController.js').ActiveUserData} ActiveUserData 
 */

const PostActiveUsers = async (UserId) => {
    const CurrentDate = moment().day().valueOf();
    const [checkActiveUser] = await ReadActiveUsers({ UserId, Data: CurrentDate }, undefined, 1, undefined);
    if (!checkActiveUser) {
        await CreateActiveUsers({ UserId, Data: CurrentDate });
    }
    return;
}



export {
    PostActiveUsers
}