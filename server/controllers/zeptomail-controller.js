import ENV from "../Env.js";

import axios from 'axios';

import { SendMailClient } from 'zeptomail'

const url = "api.zeptomail.com/";
const token = ENV.ZeptoMailToken;

let client = new SendMailClient({ url, token });

const DefaultEmailOrigin = ENV.ModeOfDevelopment === "Production" ? "horasis.org" : "epoqzero.com"

/**
 * 
 * @param {string} emailid 
 * @param {string} subject 
 * @param {string} htmlbody 
 * @param {string} bounce_address 
 * @param {string} from_address
 * @returns {Promise<true|string>}
 */
const EmailAPI = async (emailid, subject, htmlbody, from_address = `noreply@${DefaultEmailOrigin}`, bounce_address = `bounce@support.${DefaultEmailOrigin}`,) => {

    // @ts-ignore
    return client.sendMail({
        "from": { 'address': from_address },
        "to": [{ 'email_address': { 'address': emailid } }],
        "subject": subject,
        "htmlbody": htmlbody,
    })
        .then(snap => {
            console.log(emailid);
            return true;
        })
        .catch(error => {
            console.log(error);
            const MainErrorMessage = error.response.data.error.message;
            const SideErrorMessage = error.response.data.error.details.map(id => id.message).join(" ,");
            return `${MainErrorMessage} : ${SideErrorMessage}`;
        })
};

export {
    EmailAPI,
}