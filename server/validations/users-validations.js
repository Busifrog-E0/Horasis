import Joi from 'joi';
import { QueryParametersSchema } from './common.js';
import { AgendaDataSchema } from './events-validations.js';

const UserSchema = Joi.object({
    FullName: Joi.string().required(),
    Username: Joi.string().min(3).required(),
    Email: Joi.string().email().lowercase().required(),
    Password: Joi.string().min(8).required(),
    Country: Joi.string().required(),
    City: Joi.string().required(),
    JobTitle: Joi.string(),
    Industry: Joi.string(),
    CompanyName: Joi.string(),
    About: Joi.string().max(500).allow(""),
    Interests : Joi.array().items(Joi.string()).default([]),
});

const InvitationDataSchema = Joi.object({
    EmailId: Joi.string().email().lowercase().required(),
    Agenda: AgendaDataSchema
})

const ValidateGetUsers = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Roles: Joi.string().valid("User", "Admin"),
    }).validate(req.query, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.query = Result.value;
        return next();
    }
}

const ValidateUserRegister = async (req, res, next) => {
    const Result = UserSchema.validate(req.body, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }

}

const ValidateUserLogin = async (req, res, next) => {
    const Result = Joi.object({
        Email: Joi.string().email().lowercase().required(),
        Password: Joi.string().min(8).required(),
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

const ValidateVerifyOTP = async (req, res, next) => {
    const Result = Joi.object({
        OTP: Joi.string().length(6).required(),
        OTPId: Joi.string().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }

}

const ValidateCheckUsername = async (req, res, next) => {
    const Result = Joi.object({
        Username: Joi.string().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }

}

const ValidatePatchUsers = async (req, res, next) => {
    const Result = Joi.object({
        FullName: UserSchema.extract("FullName"),
        Username: UserSchema.extract("Username"),
        Country: UserSchema.extract("Country"),
        CompanyName: UserSchema.extract("CompanyName"),
        About: UserSchema.extract("About"),
        JobTitle: UserSchema.extract("JobTitle"),
        Interests : UserSchema.extract("Interests"),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }

}

const ValidatePatchUserPictures = async (req, res, next) => {
    const Result = Joi.object({
        CoverPicture: Joi.string().allow(""),
        ProfilePicture: Joi.string().allow(""),
    }).xor('CoverPicture', 'ProfilePicture').validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidateGetUserMedia = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Type: Joi.string().valid("image", "video", "document").required(),
    }).validate(req.query, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.query = Result.value;
        return next();
    }
}

const ValidatePostForgotPassword = async (req, res, next) => {
    const Result = Joi.object({
        Email: Joi.string().email().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePasswordReset = async (req, res, next) => {
    const Result = Joi.object({
        Password: Joi.string().min(8).required(),
        OTPId: Joi.string().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePostUsersInvite = (req, res, next) => {
    const Result = Joi.object({
        ActionType: Joi.string().valid("Discussion-Invite-Member", "Event-Invite-Member", "Event-Invite-Speaker","Podcast-Invite-Member").required(),
        InvitationData: Joi.array().items(InvitationDataSchema).max(5).required(),
        EntityId: Joi.string().required()
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

const ValidateMailCheck = (req, res, next) => {
    const Result = Joi.object({
        UserRole: Joi.string().valid("Member", "Speaker").required(),
        Email: Joi.string().email().lowercase().required(),
        EntityType: Joi.string().valid("Discussion", "Event").required()
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
    ValidateUserRegister, ValidateUserLogin,
    ValidateVerifyOTP, ValidateCheckUsername,
    ValidatePatchUsers, ValidatePatchUserPictures,
    ValidateGetUserMedia, ValidatePostForgotPassword,
    ValidatePasswordReset, ValidatePostUsersInvite,
    ValidateMailCheck, ValidateGetUsers

}