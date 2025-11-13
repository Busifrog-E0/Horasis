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
const MongoDB_Host = ModeOfDevelopment === "Production" ? process.env.MongoDB_Host_Production : process.env.MongoDB_Host_Debug;

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
/**
 * @type {string}
 */
// @ts-ignore
const GOOGLE_TRANSLATE_KEY = process.env.GOOGLE_TRANSLATE_KEY

/**
 * @type {string}
 */
// @ts-ignore
const ZeptoMailToken = ModeOfDevelopment === "Production" ? process.env.ZeptoProductionMailToken : process.env.ZeptoDebugMailToken;

const ZeptoMailURL = ModeOfDevelopment === "Production" ? "api.zeptomail.com/" : "api.zeptomail.in/";
/**
 * @type {string}
 */
// @ts-ignore
const AGORA_APP_ID = process.env.AGORA_APP_ID;

/**
 * @type {string}
 */
// @ts-ignore
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

/**
 * @type {string}
 */
//@ts-ignore
const { EXTERNAL_SPEAKER_URL } = process.env;


const SocketProductionOrigin = ["https://social.horasis.org", "https://socialfb.horasis.org"];
const SocketDebugOrigin = ["https://localhost:5173", "http://127.0.0.1:5173", "https://hsocial.web.app", "https://hsocialtest.web.app", "https://tcs-networking.web.app"]

/**
 * @type {Array<string>}
 */
const SOCKET_ORIGIN = ModeOfDevelopment === "Production" ? SocketProductionOrigin : SocketDebugOrigin;


const ProductionOrigin = ["https://horasis-daef9.web.app", "https://social.horasis.org"];
const DebugOrigin = ['https://hsocial.web.app', 'http://localhost:5173', "https://tcs-networking.web.app"]

/**
 * @type {Array<string>}
 */
const ALLOWED_ORIGIN = ModeOfDevelopment === "Production" ? ProductionOrigin : DebugOrigin;

/**
 * @type {string}
 */
// @ts-ignore
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

/**
 * @type {string}
 */
// @ts-ignore
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * @type {"https://social.horasis.org"|"https://hsocial.web.app"}
 */
const NEW_USER_WITH_REGISTRATION_CODE = ModeOfDevelopment === "Production" ? "https://social.horasis.org" : "https://hsocial.web.app";

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
    ZeptoMailToken,
    ZeptoMailURL,
    GOOGLE_TRANSLATE_KEY,
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    EXTERNAL_SPEAKER_URL,
    SOCKET_ORIGIN,
    ALLOWED_ORIGIN,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
    NEW_USER_WITH_REGISTRATION_CODE,
}