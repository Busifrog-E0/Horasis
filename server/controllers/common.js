import axios from "axios";
import bcrpyt from 'bcrypt';
import { ReadOneFromActivities } from "../databaseControllers/activities-databaseController.js";
import { ReadOneFromComments } from "../databaseControllers/comments-databaseController.js";
const UserFields = [
    "FullName",
    "Username",
    "Email",
    "Country",
    "City",
    "JobTitle",
    "Industry",
    "CompanyName",
    "About",
    "ProfilePicture",
    "CoverPicture"
];

/**
 * 
 * @param {string} Password 
 * @returns {Promise<string>}
 */
const hashPassword = async (Password) => {
    const salt = await bcrpyt.genSalt(10);
    const hashedPassword = await bcrpyt.hash(Password, salt);
    return hashedPassword;
}

/**
 * 
 * @param {string} Password 
 * @param {string} HashedPassword 
 * @returns {Promise<boolean>}
 */
const ComparePassword = async (Password, HashedPassword) => {
    return await bcrpyt.compare(Password, HashedPassword);
}


/**
 * 
 * @param {string} Header 
 * @param {string} Message 
 * @param {boolean} SubscriptionButton 
 * @param {boolean} CloseButton 
 * @param {boolean} UpdateButton 
 * @returns 
 */

const AlertBoxObject = (Header, Message, SubscriptionButton = false, CloseButton = true, UpdateButton = false) => {
    return {
        Header,
        Message,
        SubscriptionButton,
        UpdateButton,
        CloseButton
    }
}

/**
 * @property {boolean} TestUser
 * @returns {string}
 */
const getOTP = (TestUser = false) => {
    if (TestUser) {
        return "123456";
    }
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    //return OTP;
    return "123456";
}

/**
 * 
 * @param {object} Data 
 */
const GetUserNonEmptyFieldsPercentage = (Data) => {
    const NoOfFields = UserFields.length;
    const NoOfFilledFields = UserFields.reduce((Num, Field) => {
        if (Data[Field] !== undefined && Data[Field] !== "") {
            return Num + 1;
        }
        return Num;
    }, 0)
    return Math.round((NoOfFilledFields / NoOfFields) * 100);
}

const GetFileFromURI = async (URI) => {
    const FileResponse = await axios.get(URI, {
        responseType: "arraybuffer"
    });
    const File = Buffer.from(FileResponse.data, 'binary');
    return File;
}

/**
 * 
 * @param {number} Count
 * @param {number} TotalCount
 */
const GetPercentageOfData = (Count, TotalCount) => {
    const Percentage = parseFloat(((Count / TotalCount) * 100).toFixed(2));
    return Percentage;
}


const GetParentTypeFromEntity = async (EntityId, EntityType) => {
    let ParentId, ParentType;
    switch (EntityType) {
        case "Activity": {
            const Activity = await ReadOneFromActivities(EntityId);
            ParentId = Activity.EntityId;
            ParentType = Activity.Type;
            break;
        }
        case "Comment": {
            const Comment = await ReadOneFromComments(EntityId);
            let Activity;
            if (Comment.Type === "Reply") {
                const Entity = await ReadOneFromComments(Comment.ParentId);
                Activity = await ReadOneFromActivities(Entity.ParentId);
            }
            else {
                Activity = await ReadOneFromActivities(Comment.ParentId);
            }
            ParentId = Activity.EntityId;
            ParentType = Activity.Type;
            break;
        }
        case "Article": {
            ParentId = EntityId;
            ParentType = 'Article';
            break;
        }
        default: break;
    }
    return { ParentId, ParentType }
}



/**
 * 
 * @param {string} Message 
 * @param {number} StatusCode 
 * @returns 
 */
const SocketError = (Message, StatusCode) => {
    const err = new Error(Message);
    // @ts-ignore
    err.data = { Message, StatusCode };
    return err;
}

export {
    AlertBoxObject,
    getOTP,
    GetUserNonEmptyFieldsPercentage,
    GetFileFromURI,
    SocketError,
    GetPercentageOfData,
    hashPassword,
    ComparePassword,
    GetParentTypeFromEntity
}