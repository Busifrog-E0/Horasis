import Joi from 'joi';
import { QueryParametersSchema } from './common.js';

const UserSchema = Joi.object({
    FullName: Joi.string().required(),
    Username: Joi.string().required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).required(),
    Country: Joi.string().required(),
    City: Joi.string().required(),
    JobTitle: Joi.string().required(),
    Industry: Joi.string().required(),
    CompanyName: Joi.string().required(),
    About: Joi.string().max(500),
});



const ValidateUserRegister = async (req, res, next) => {
    const Result = UserSchema.validate(req.body, { stripUnknown: true });
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
        Email: Joi.string().email().required(),
        Password: Joi.string().min(8).required(),
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


export {
    ValidateUserRegister, ValidateUserLogin,
    ValidateVerifyOTP,ValidateCheckUsername
}