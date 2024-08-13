import Joi from "joi";
import { QueryParametersSchema } from "./common.js";

const MembersGetSchema = QueryParametersSchema.keys({
    'Permissions.CanInviteOthers': Joi.boolean(),
    'Permissions.CanPostActivity': Joi.boolean(),
    'Permissions.CanUploadPhoto': Joi.boolean(),
    'Permissions.CanCreateAlbum': Joi.boolean(),
    'Permissions.CanUploadVideo': Joi.boolean(),
    'Permissions.IsAdmin': Joi.boolean(),
}).xor('Permissions.CanInviteOthers', 'Permissions.CanPostActivity', 'Permissions.CanUploadPhoto',
    'Permissions.CanCreateAlbum', 'Permissions.CanUploadVideo', 'Permissions.IsAdmin');


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

export {
    ValidateGetMembers
}