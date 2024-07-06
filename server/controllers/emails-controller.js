import { EmailAPI } from "./zeptomail-controller"

/**
 * @param {import('./../databaseControllers/users-databaseController.js').UserData} UserData 
 * @param {{"name":string,"verification_link":string,"username":string}} MergeInfo 
 * @returns {Promise<string|true>}
 */
const AccountVerificationEmail = async (UserData, MergeInfo) => {
    // @ts-ignore
    MergeInfo = { ...MergeInfo, "team": "Horissa", "product_name": "Horissa" };
    const VerificationTemplateId = "2518b.7d5b154c30adb8bd.k1.834092b0-3b59-11ef-b3cf-525400674725.190868a075b";
    return EmailAPI(UserData.Email, "Verification Link", VerificationTemplateId, MergeInfo);
}

export {
    AccountVerificationEmail,
}