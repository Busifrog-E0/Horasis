import agora from 'agora-token'
import { ReadSpeakers } from '../databaseControllers/speakers-databaseController.js';
import { ReadMembers } from '../databaseControllers/members-databaseController.js';
import { AlertBoxObject } from './common.js';
import Env from '../Env.js';
const { RtcTokenBuilder, RtcRole } = agora;

const generateRTCToken = async (req, res) => {
    const { EventId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const [[Speaker], [Member]] = await Promise.all([
        ReadSpeakers({ SpeakerId: UserId, EventId }, undefined, 1, undefined),
        ReadMembers({ MemberId: UserId, EntityId: EventId }, undefined, 1, undefined)
    ]);
    const Role = Speaker ? RtcRole.PUBLISHER : (Member ? RtcRole.SUBSCRIBER : undefined);
    if (!Role) {
        return res.status(444).json(AlertBoxObject("Cannot Generate Token", "You are not a member of this event"))
    }
    const token = RtcTokenBuilder.buildTokenWithUid(Env.AGORA_APP_ID, Env.AGORA_APP_CERTIFICATE, EventId, UserId, Role, 600, 600);
    return res.json({ Token: token });
}


export {
    generateRTCToken
}