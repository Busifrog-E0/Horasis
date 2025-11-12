import Joi from 'joi';
import { QueryParametersSchema } from './common.js';
import moment from 'moment';
import { TagsSchema } from './tags-validations.js';
import e from 'express';

const AgendaDataSchema = Joi.object({
    Name: Joi.string().required(),
    Description: Joi.string(),
    Date: Joi.number().required(),  // Assume it's a timestamp (milliseconds since epoch)
    StartTime: Joi.number().required(),
    EndTime: Joi.number().required(),
    Location: Joi.string().required()
});

const EventDataSchema = Joi.object({
    OrganiserId: Joi.string().required(),
    EventName: Joi.string().required(),
    Description: Joi.string().required(),
    Date: Joi.number().required(),  // Assume it's a timestamp (milliseconds since epoch)
    StartTime: Joi.number().required(),  // Timestamp in milliseconds
    EndDate: Joi.number().required(),  // Assume it's a timestamp (milliseconds since epoch)
    EndTime: Joi.number().required(),  // Timestamp in milliseconds
    Agenda: Joi.array().items(AgendaDataSchema).required(),
    Location: Joi.string().required(),
    Privacy: Joi.string().valid('Public', 'Private').required(),
    Type: Joi.string().valid('Virtual', 'Offline').required(),
    Country: Joi.string().required(),
    DisplayPicture: Joi.string().required(),
    CoverPicture: Joi.string().required(),
    HasDiscussion: Joi.boolean().required(),
    Tags: Joi.array().items(TagsSchema).default([]),
    Capacity: Joi.number()
}).custom((value, helpers) => {
    const currentTime = moment().valueOf();

    if (value.StartTime >= value.EndTime) {
        //@ts-ignore
        return helpers.message('"StartTime" must be less than "EndTime"');
    }

    if (value.Date <= currentTime) {
        // @ts-ignore
        return helpers.message('"Date" must be a future date');
    }

    if (value.StartTime <= currentTime) {
        // @ts-ignore
        return helpers.message('"StartTime" must be in the future');
    }

    return value;
});


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidatePostEvents = async (req, res, next) => {
    const Result = EventDataSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
};


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidatePatchEventCoverPhoto = async (req, res, next) => {
    const Result = Joi.object({
        CoverPicture: Joi.string().required()
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
const ValidateGetEvents = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        StartTime: Joi.object({
            $lte: Joi.number(),
            $gte: Joi.number()
        }).custom((value, helpers) => {
            if (value.$gte >= value.$lte) {
                //@ts-ignore
                return helpers.message('Start Date should be less than End Date');
            }
            return value;
        }),
        Privacy: Joi.string().valid('Public', 'Private'),
        Type: Joi.string().valid('Virtual', 'Offline'),
        Country: Joi.string(),
    }).validate(req.query, { stripUnknown: true, convert: true });
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
const ValidatePostSpeakers = async (req, res, next) => {
    const Result = Joi.object({
        Agenda: AgendaDataSchema.keys({
            AgendaId: Joi.string().required()
        }).required()
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
const ValidatePostSpeakerMailInvite = async (req, res, next) => {
    const Result = Joi.object({
        InvitationData: Joi.array().items(
            Joi.object({
                Email: Joi.string().email().lowercase().required(),
                FullName: Joi.string().required(),
                Agenda: AgendaDataSchema.keys({
                    AgendaId: Joi.string().required()
                }).required(),
                About: Joi.string().max(500).allow("").required()
            })
        ).max(5).required()
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
    ValidatePostEvents,
    ValidateGetEvents,
    ValidatePostSpeakers,
    AgendaDataSchema,
    ValidatePostSpeakerMailInvite,
    ValidatePatchEventCoverPhoto
}