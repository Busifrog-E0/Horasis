import axios from "axios";
import moment from "moment";

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
        if (Data[Field] != undefined && Data[Field] !== "") {
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
}