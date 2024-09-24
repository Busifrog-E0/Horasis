import { EmailAPI } from "./zeptomail-controller.js"
import Env from "../Env.js"
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
 * @returns {Promise<string|true>}
 */
const SendOTPEmail = async (Email, OTP, Name) => {
    const htmlbody = `<table cellspacing="0" cellpadding="0" style="background-color: #F4F6F7; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #DEE6E9; border-radius: 10px; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: auto; max-width: 600px; overflow: hidden; width: 600px;">


                        <h2 style="color: #fff; font-size: 24px; font-weight: normal; margin: 0;">Horasis</h2>
                    </div>
                        <p style="font-size: 14px; margin: 0; margin-bottom: 25px;">Hi ${Name}</p>
                        <p style="font-size: 16px; margin: 0; margin-bottom: 35px; line-height: 22px;">
                            Below is your
                            <strong>One time password:</strong>
                        </p>
                        <div style="text-align: center;">
                            <div
                                style="background-color: #25586B0D; border-radius: 6px; color: #25586B; display: inline-block; font-size: 30px; padding: 20px 30px;">
                                ${OTP}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; margin-top: 15px;">
                        </div>
                        <p style="font-size: 14px; margin: 0; margin: 35px 0;  line-height: 22px;">If you didn't request
                            this one time password, ignore the email.</p>
                        <p style="font-size: 14px; margin: 0; line-height: 22px;">Thank you,</p>
                        <p style="font-size: 14px; margin: 0; line-height: 22px;">Team Horasis</p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>`;

    return EmailAPI(Email, "Verify OTP", htmlbody);
}

/**
 * 
 * @param {string} Email 
 * @param {string} SpeakerId
 * @param {import("../databaseControllers/events-databaseController.js").EventData} Event 
 * @param {import("../databaseControllers/speakers-databaseController.js").AgendaData} Agenda
 * @param {string} FullName
 */
const SendSpeakerInviteEmail = async (Email, SpeakerId, Event, Agenda, FullName) => {
    const InviteLink = Env.EXTERNAL_SPEAKER_URL + SpeakerId;
    const htmlbody = `<table cellspacing="0" cellpadding="0" style="background-color: #F4F6F7; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #DEE6E9; border-radius: 10px; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: auto; max-width: 600px; overflow: hidden; width: 600px;">
                    <div
                        style="background-color: #25586B; padding: 40px; text-align: center; background-image: url(../images/sampleTemplates/otp.svg); background-repeat: no-repeat; background-position: calc( 100% - 20px ) 20px; background-size: 50px;">
                        <h2 style="color: #fff; font-size: 24px; font-weight: normal; margin: 0;">
                            <span class="size" style="font-size: 32px">Horasis</span><span class="size" style="font-size: 24px">​</span>
                        </h2>
                    </div>
                    <div
                        style="padding: 40px 50px; background-image: url(../images/sampleTemplates/shadow.svg); background-repeat: no-repeat; background-position: top; background-size: contain;">
                        <p style="margin: 0px 0px 25px;">
                            <span class="size" style="font-size: 16px">Hi ${FullName}</span><span class="size" style="font-size: 16px"><br></span>
                        </p>
                        <p style="margin: 0px 0px 35px; line-height: 22px;">
                            <span class="size" style="font-size: 16px">We’re excited to invite you to be a speaker at our upcoming event, </span><b><span class="size" style="font-size: 16px">${Event.EventName}</span></b><span class="size" style="font-size: 16px">, scheduled for </span><b><span class="size" style="font-size: 16px">${Event.Date}</span></b><span class="size" style="font-size: 16px"> at </span><b><span class="size" style="font-size: 16px">${Event.StartTime}</span></b><span class="size" style="font-size: 16px">. As a speaker, you’ll be presenting on the following topic: </span><b><span class="size" style="font-size: 16px">${Agenda.Name}</span></b><span class="size" style="font-size: 16px">.</span><span class="size" style="font-size: 16px"><br></span>
                        </p>
                        <div>
                            <span class="size" style="font-size: 16px">To join the event as a speaker, please click the link below at the event’s start time:</span><span class="size" style="font-size: 16px"><br></span>
                        </div>
                        <div><span class="size" style="font-size: 16px"><br></span></div>
                        <div class="align-center" style="text-align: center;">
                            <span class="size" style="font-size: 16px"> </span><a target="_blank"
                                href=${InviteLink}><span class="size" style="font-size: 16px">{{link}}</span></a><span class="size" style="font-size: 16px"> </span><span class="size" style="font-size: 16px"><br></span>
                        </div>
                        <div><span class="size" style="font-size: 16px"><br></span></div>
                        <div>
                            <span class="size" style="font-size: 16px">If this wasn’t something you requested or if you have any questions, feel free to ignore this email.</span><span class="size" style="font-size: 16px"><br></span>
                        </div>
                        <div><span class="size" style="font-size: 16px"><br></span></div>
                        <div>
                            <span class="size" style="font-size: 16px">Thank you,</span><span class="size" style="font-size: 16px"><br></span>
                        </div>
                        <p style="margin: 0px; line-height: 22px;">
                            <span class="size" style="font-size: 16px">Team Horasis</span><br></p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<div><br></div>`
    return EmailAPI(Email, "Speaker Invitation", htmlbody);
}

/**
 * 
 * @param {string} Email 
 * @param {string} FullName 
 * @param {string} OTP 
 * @returns 
 */
const ForgotPasswordOTPEmail = async (Email, FullName, OTP) => {
    const htmlbody = `<table cellspacing="0" cellpadding="0" style="background-color: #F4F6F7; border: 1px solid #eee; width: 100%;">
    <tbody>
        <tr>
            <td>
                <div
                    style="background-color: #fff; border: 1px solid #DEE6E9; border-radius: 10px; box-sizing: border-box; font-family: Lato, Helvetica, 'Helvetica Neue', Arial, 'sans-serif'; margin: auto; max-width: 600px; overflow: hidden; width: 600px;">
                    <div
                        style="background-color: #25586B; padding: 40px; text-align: center; background-image: url(../images/sampleTemplates/otp.svg); background-repeat: no-repeat; background-position: calc( 100% - 20px ) 20px; background-size: 50px;">
                        <h2 style="color: #fff; font-size: 24px; font-weight: normal; margin: 0;">Horasis<br></h2>
                    </div>
                    <div
                        style="padding: 40px 50px; background-image: url(../images/sampleTemplates/shadow.svg); background-repeat: no-repeat; background-position: top; background-size: contain;">
                        <p style="margin: 0px 0px 25px;">
                            <span class="size" style="font-size: 14px; margin: 0px 0px 25px;">Hi ${FullName}</span><br></p>
                        <p style="margin: 0px 0px 35px; line-height: 22px;">
                            <span class="size" style="font-size: 16px; margin: 0px 0px 35px; line-height: 22px;">We received a request to reset your password. Use the <b>one-time password (OTP)</b> below to proceed with the reset:</span><br>
                        </p>
                        <div style="text-align: center;">
                            <div
                                style="background-color: #25586B0D; border-radius: 6px; color: #25586B; display: inline-block; font-size: 30px; padding: 20px 30px;">
                                ${OTP}</div><br>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; margin-top: 15px;">
                            <div
                                style="background-image: url(../images/sampleTemplates/copy.svg); background-repeat: no-repeat; background-size: contain; height: 14px; width: 14px;">
                                <br></div>
                        </div>
                        <p style="margin: 35px 0px; line-height: 22px;">
                            <span class="size" style="font-size: 14px; margin: 35px 0px; line-height: 22px;">If you didn't request this one time password, ignore the email.</span><br>
                        </p>
                        <p style="margin: 0px; line-height: 22px;">
                            <span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">Thank you,</span><br>
                        </p>
                        <p style="margin: 0px; line-height: 22px;">
                            <span class="size" style="font-size: 14px; margin: 0px; line-height: 22px;">Team Horasis</span><br>
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table>
<div><br></div>`;
    return EmailAPI(Email, "Forgot Password", htmlbody);
}


export {
    AccountVerificationEmail, SendOTPEmail, SendSpeakerInviteEmail,
    ForgotPasswordOTPEmail
}

