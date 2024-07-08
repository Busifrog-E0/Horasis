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


export {
    AlertBoxObject,
    getOTP
}