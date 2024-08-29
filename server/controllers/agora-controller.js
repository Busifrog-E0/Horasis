import { RtcTokenBuilder, RtcRole } from 'agora-access-token'
import { ReadSpeakers } from '../databaseControllers/speakers-databaseController';
import { ReadMembers } from '../databaseControllers/members-databaseController';
import { AlertBoxObject } from './common';
import Env from '../Env';
import moment from 'moment';

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
    const token = RtcTokenBuilder.buildTokenWithUid(Env.AGORA_APP_ID, Env.AGORA_APP_CERTIFICATE, EventId, UserId, Role, moment().valueOf() + 21600000);
    return res.json({ Token: token });
}


export {
    generateRTCToken
}