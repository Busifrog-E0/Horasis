import dotenv from 'dotenv';
dotenv.config();

/**
 * @type {string} - This give the port number
 */
// @ts-ignore
const PORT = process.env.PORT;


/**
 * @type {"Debug"|"Production"}
 */
// @ts-ignore
const ModeOfDevelopment = process.env.ModeOfDevelopment;

/**
 * @type {string}
 */
// @ts-ignore
const MongoDB_Host = process.env.MongoDB_Host;

/**
 * @type {string}
 */
// @ts-ignore
const TOKEN_KEY = process.env.TOKEN_KEY;


/**
 * @type {string}
 */
// @ts-ignore
const DO_SPACES_ENDPOINT = process.env.DO_SPACES_ENDPOINT;

/**
 * @type {string}
 */
// @ts-ignore
const DO_SPACES_FILEURL = process.env.DO_SPACES_FILEURL;
/**
 * @type {string}
 */
// @ts-ignore
const DO_SPACES_KEY = process.env.DO_SPACES_KEY;
/**
 * @type {string}
 */
// @ts-ignore
const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET;
/**
 * @type {string}
 */
// @ts-ignore
const DO_SPACES_NAME = process.env.DO_SPACES_NAME;


export default {
    PORT,
    ModeOfDevelopment,
    MongoDB_Host,
    TOKEN_KEY,
    DO_SPACES_ENDPOINT,
    DO_SPACES_FILEURL,
    DO_SPACES_KEY,
    DO_SPACES_SECRET,
    DO_SPACES_NAME,
}