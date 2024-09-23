import { EmailAPI } from "./zeptomail-controller.js"

const TestUsers = [
    "qwertyui@tgmail.com",
]


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
 * @param {string} Description 
 * @returns {Promise<string|true>}
 */
const SendOTPEmail = async (Email, OTP, Name,Description) => {
    const OTPTemplateId = "2518b.7d5b154c30adb8bd.k1.0eec7d30-3ced-11ef-afa0-525400674725.19090deb483"
    const MergeInfo = {
        "name": Name,
        "description": Description,
        "OTP": OTP,
        "team": "team_value",
        "product_name": "product_name_value"
    };
    return EmailAPI(Email, "Verify OTP", OTPTemplateId, MergeInfo);
}

/**
 * 
 * @param {string} Email 
 * @param {string} SpeakerDocId 
 * @param {import("../databaseControllers/events-databaseController.js").EventData} Event 
 * @param {import("../databaseControllers/speakers-databaseController.js").AgendaData} Agenda
 * @param {string} FullName
 */
const SendSpeakerInviteEmail = async (Email, SpeakerId, Event, Agenda, FullName) => {
    const InviteLink = `https://example.com/speaker/${SpeakerId}`
    const SpeakerInviteTemplateId = "";
    const MergeInfo = {
        "eventName": Event.EventName,
        "agendaName": Agenda.Name,
        "agendaStartTime": Agenda.StartTime,
        "agendaEndTime": Agenda.EndTime,
        "name": FullName,
        "inviteLink": InviteLink
    }
    return EmailAPI(Email, "Speaker Invitation", SpeakerInviteTemplateId, MergeInfo);
}

/* const ListOTPs = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {//$text: { $search: `\"${Keyword}\"` } };
        // @ts-ignore

        Filter["$or"] = [
            { "PhoneNumberString": { $regex: Keyword, "$options": 'i' } },
        ];
    }
    const data = await Read('OTP', undefined, NextId, Limit, Filter, OrderBy);
    return res.json(data);
} */



export {
    AccountVerificationEmail, SendOTPEmail,SendSpeakerInviteEmail
}

