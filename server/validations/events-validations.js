import Joi from 'joi';
import { QueryParametersSchema } from './common.js';

const AgendaDataSchema = Joi.object({
    Name: Joi.string().required(),
    Description: Joi.string(),
    StartTime: Joi.number().required(),
    EndTime: Joi.number().required()
});

const EventDataSchema = Joi.object({
    OrganiserId: Joi.string().required(),
    EventName: Joi.string().required(),
    Description: Joi.string().required(),
    Date: Joi.number().required(),
    StartTime: Joi.number().required(),
    EndTime: Joi.number().required(),
    Agenda: Joi.array().items(AgendaDataSchema).required(),
    Privacy: Joi.string().valid('Public', 'Private').required(),
    Type: Joi.string().valid('Virtual', 'Offline').required(),
    Country: Joi.string().required(),
    DisplayPicture: Joi.string().required(),
    CoverPicture: Joi.string().required(),
    HasDiscussion: Joi.boolean().required()
});

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

const ValidateGetEvents = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        StartTime: Joi.number(),
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

export {
    ValidatePostEvents,
    ValidateGetEvents
}