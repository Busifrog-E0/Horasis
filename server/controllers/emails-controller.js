import { EmailAPI } from "./zeptomail-controller.js"
import Env from "../Env.js"
import moment from "moment";
const TestUsers = [
    "qwertyui@tgmail.com",
]


// Verify you email address
/**
 * 
 * @param {string} Email 
 * @param {string} OTP 
 * @param {string} Name 
 * @returns {Promise<string|true>}
 */
const SendOTPEmail = async (Email, OTP, Name) => {
    const htmlbody = `<div class=""><div class="aHl"></div><div id=":o6" tabindex="-1"></div><div id=":nf" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTgzMTg5ODQxMDI4MjQwMjUzNCJd; 4:WyIjbXNnLWY6MTgzMTg5ODQxMDI4MjQwMjUzNCIsbnVsbCxudWxsLG51bGwsMSwwLFsxLDAsMF0sNTMsMzIyLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwxLG51bGwsbnVsbCxbMF0sbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsMF0."><div id=":ng" class="a3s aiL "><table cellspacing="0" cellpadding="0" style="background-color:#f4f6f7;border:1px solid #eee;width:100%">
    <tbody>
        <tr>
            <td>
                <div style="background-color:#fff;border:1px solid #dee6e9;border-radius:10px;box-sizing:border-box;font-family:Lato,Helvetica,'Helvetica Neue',Arial,'sans-serif';margin:auto;max-width:600px;overflow:hidden;width:600px">

                    <div style="background-color:#25586b;padding:40px;text-align:center;background-image:url();background-repeat:no-repeat;background-position:calc(100% - 20px) 20px;background-size:50px">
                        <h2 style="color:#fff;font-size:24px;font-weight:normal;margin:0">Horasis</h2>
                    </div>
                    <div style="padding:40px 50px;background-image:url();background-repeat:no-repeat;background-position:top;background-size:contain">
                        <p style="font-size:14px;margin:0;margin-bottom:25px">Hi ${Name}</p>
                        <p style="font-size:16px;margin:0;margin-bottom:35px;line-height:22px">
                            Verify you email address. Below is your
                            <strong>One time password:</strong>
                        </p>
                        <div style="text-align:center">
                            <div style="background-color:#25586b0d;border-radius:6px;color:#25586b;display:inline-block;font-size:30px;padding:20px 30px">
                                ${OTP}
                            </div>
                        </div>
                        <div style="display:flex;margin-top:15px">
                            <div style="background-image:url();background-repeat:no-repeat;background-size:contain;height:14px;width:14px">
                            </div>
                        </div>
                        <p style="font-size:14px;margin:0;margin:35px 0;line-height:22px">If you didn't request
                            this one time password, ignore the email.</p>
                        <p style="font-size:14px;margin:0;margin-bottom:35px;line-height:22px">If you'd like to
                            know more about Horasis or want to get in touch with us, get in touch with our
                            customer support team.</p>
                        <p style="font-size:14px;margin:0;line-height:22px">Thank you,</p>
                        <p style="font-size:14px;margin:0;line-height:22px">Team Horasis</p>
                    </div>
                </div>
            </td>
        </tr>
    </tbody>
</table><div class="yj6qo"></div><div class="adL">
</div></div></div><div class="WhmR8e" data-hash="0"></div></div>`;

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
                            <span class="size" style="font-size: 16px">We’re excited to invite you to be a speaker at our upcoming event, </span><b><span class="size" style="font-size: 16px">${Event.EventName}</span></b><span class="size" style="font-size: 16px">, scheduled for </span><b><span class="size" style="font-size: 16px">${moment(Event.Date).format("DD-MM-YYYY")}</span></b><span class="size" style="font-size: 16px"> at </span><b><span class="size" style="font-size: 16px">${moment(Event.StartTime).format("HH:mm")}</span></b><span class="size" style="font-size: 16px">. As a speaker, you’ll be presenting on the following topic: </span><b><span class="size" style="font-size: 16px">${Agenda.Name}</span></b><span class="size" style="font-size: 16px">.</span><span class="size" style="font-size: 16px"><br></span>
                        </p>
                        <div>
                            <span class="size" style="font-size: 16px">To join the event as a speaker, please click the link below at the event’s start time:</span><span class="size" style="font-size: 16px"><br></span>
                        </div>
                        <div><span class="size" style="font-size: 16px"><br></span></div>
                        <div class="align-center" style="text-align: center;">
                            <span class="size" style="font-size: 16px"> </span><a target="_blank"
                                href=${InviteLink}><span class="size" style="font-size: 16px">${InviteLink}</span></a><span class="size" style="font-size: 16px"> </span><span class="size" style="font-size: 16px"><br></span>
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

(async () => {
    await SendOTPEmail("harismoylan@gmail.com", "123456", "qwertyui");
})();

export {
    SendOTPEmail, SendSpeakerInviteEmail,
    ForgotPasswordOTPEmail
}

