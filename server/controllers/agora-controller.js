import agora from 'agora-token'
import { ReadSpeakers } from '../databaseControllers/speakers-databaseController.js';
import { ReadMembers } from '../databaseControllers/members-databaseController.js';
import { AlertBoxObject } from './common.js';
import Env from '../Env.js';
import { ReadParticipants } from '../databaseControllers/participants-databaseController.js';
const { RtcTokenBuilder, RtcRole } = agora;

const generateRTCToken = async (req, res) => {
    const { EventId } = req.params;
    //@ts-ignore
    const { UserId } = req.user;
    const [[Speaker], [Member]] = await Promise.all([
        ReadSpeakers({ SpeakerId: UserId, EventId, MembershipStatus: "Accepted" }, undefined, 1, undefined),
        ReadMembers({ MemberId: UserId, EntityId: EventId, MembershipStatus: "Accepted" }, undefined, 1, undefined)
    ]);
    const Role = Speaker ? RtcRole.PUBLISHER : (Member ? RtcRole.SUBSCRIBER : undefined);
    if (!Role) {
        return res.status(444).json(AlertBoxObject("Cannot Generate Token", "You are not a member of this event"))
    }
    const token = RtcTokenBuilder.buildTokenWithUid(Env.AGORA_APP_ID, Env.AGORA_APP_CERTIFICATE, EventId, UserId, Role, 6000, 6000);
    const UserRole = Role === RtcRole.PUBLISHER ? "Speaker" : "Member";
    return res.json({ Token: token, Role: UserRole });
}

const GetParticipants = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter.$or = [
            { "UserDetails.FullName": { $regex: Keyword, $options: 'i' } },
            { "UserDetails.Username": { $regex: Keyword, $options: 'i' } },
        ];
    }
    //@ts-ignore
    Filter.EventId = req.params.EventId;
    // @ts-ignore
    const data = await ReadParticipants(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

export {
    generateRTCToken,
    GetParticipants
}