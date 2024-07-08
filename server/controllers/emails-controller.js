import { EmailAPI } from "./zeptomail-controller.js"

/**
 * @param {import('./../databaseControllers/users-databaseController.js').UserData} UserData 
 * @param {string} verification_link 
 * @returns {Promise<string|true>}
 */
const AccountVerificationEmail = async (UserData, verification_link) => {
    const MergeInfo = {
        verification_link,
        name: UserData.FullName,
        username: UserData.Username,
        team: "Horissa", product_name: "Horissa",
    };
    const VerificationTemplateId = "2518b.7d5b154c30adb8bd.k1.834092b0-3b59-11ef-b3cf-525400674725.190868a075b";
    return EmailAPI(UserData.Email, "Verification Link", VerificationTemplateId, MergeInfo);
}

// Verify you email address
/**
 * 
 * @param {string} Email 
 * @param {string} OTP 
 * @param {string} Name 
 * @returns 
 */
const SendRegisterOTPEmail = async (Email, OTP, Name) => {
    const OTPTemplateId = "2518b.7d5b154c30adb8bd.k1.0eec7d30-3ced-11ef-afa0-525400674725.19090deb483"
    const MergeInfo = {
        "name": Name,
        "description": "Verify Your Email",
        "OTP": OTP,
        "team": "team_value",
        "product_name": "product_name_value"
    };
    return EmailAPI(Email, "Verification Link", OTPTemplateId, MergeInfo);
}


export {
    AccountVerificationEmail, SendRegisterOTPEmail
}

// harismoylan
// paOVSc1CFZwY3G8e
