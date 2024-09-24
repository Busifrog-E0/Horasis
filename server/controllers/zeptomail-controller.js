import ENV from "../Env.js";

import axios from 'axios';



/**
 * 
 * @param {string} emailid 
 * @param {string} subject 
 * @param {string} htmlbody 
 * @param {string} bounce_address 
 * @param {string} from_address
 * @returns {Promise<true|string>}
 */
const EmailAPI = async (emailid, subject, htmlbody, from_address = "noreply@epoqzero.com", bounce_address = "bounce@support.epoqzero.com",) => {
    const data = {
        bounce_address,
        "from": { 'address': from_address },
        "to": [{ 'email_address': { 'address': emailid } }],
        "subject": subject,
        "htmlbody": htmlbody,
    };
    // @ts-ignore
    return axios({
        method: 'post',
        url: `https://api.zeptomail.in/v1.1/email/template`,
        headers: {
            "accept": "application/json",
            'content-type': 'application/json',
            "authorization": `${ENV.ZeptoMailToken}`,
        },
        data: data,
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