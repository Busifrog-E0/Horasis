import Joi from "joi";
import { QueryParametersSchema } from "./common.js";

const MembersGetSchema = QueryParametersSchema.keys({
    'Permissions.CanInviteOthers': Joi.boolean(),
    'Permissions.CanPostActivity': Joi.boolean(),
    'Permissions.CanUploadPhoto': Joi.boolean(),
    'Permissions.CanCreateAlbum': Joi.boolean(),
    'Permissions.CanUploadVideo': Joi.boolean(),
    'Permissions.IsAdmin': Joi.boolean(),
    'MembershipStatus': Joi.string().valid("Accepted", "Invited", "Requested")
});


const ValidatePostMembers = async (req, res, next) => {
    const Result = Joi.object({
        Type: Joi.string().valid("Discussion", "Event"),
    }).validate(req.body, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}


const ValidateGetMembers = async (req, res, next) => {
    const Result = MembersGetSchema.validate(req.query, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.query = Result.value;
        return next();
    }
};

const ValidateInviteMembers = async (req, res, next) => {
    const Result = Joi.object({
        Type : Joi.string().valid("Discussion","Event").required(),
    }).validate(req.body, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

export {
    ValidateGetMembers,
    ValidateInviteMembers,
    ValidatePostMembers
}