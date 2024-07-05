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




export {
    AlertBoxObject,
}