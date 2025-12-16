import Joi from "joi";
import { QueryParametersSchema } from "./common.js";
import e from "express";

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateAdmin = async (req, res, next) => {
    const Result = Joi.object({
        Username: Joi.string().required(),
        Password: Joi.string().required()
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateGetUsersByRole = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Role: Joi.string().valid("Admin", "User").required(),
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateAddAdmin = async (req, res, next) => {
    const Result = Joi.object({
        UserIds: Joi.array().items(Joi.string().required()).required(),
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateRemoveAdmin = async (req, res, next) => {
    const Result = Joi.object({
        UserId: Joi.string().required(),
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

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateSendNotificationToAllUsersByAdmin = async (req, res, next) => {
    const SendNotificationSchema = Joi.object({
        Description: Joi.string().required().messages({
            'string.base': 'Please enter a valid description.',
            'string.empty': 'Description cannot be empty.',
            'any.required': 'Description is required.',
        }),
    })
    const Result = SendNotificationSchema.validate(req.body, { stripUnknown: true });
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
    ValidateAdmin, ValidateAddAdmin, ValidateGetUsersByRole, ValidateRemoveAdmin,
    ValidateSendNotificationToAllUsersByAdmin,
}
