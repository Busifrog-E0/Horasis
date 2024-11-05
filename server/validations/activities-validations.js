import Joi from "joi"
import { QueryParametersSchema } from "./common.js";


const ActivitySchema = Joi.object({
    Content: Joi.when('Type', {
        is: Joi.string().valid("Feed", "Discussion"),
        then: Joi.string().required(),
        otherwise: Joi.any().forbidden
    }),
    MediaFiles: Joi.array().required(),
    Documents: Joi.when('Type', {
        is: Joi.string().valid("Feed", "Discussion"),
        then: Joi.array().required(),
        otherwise: Joi.any().forbidden()
    }),
    UserId: Joi.string().required(),
    Type: Joi.string().valid("Feed", "Discussion", "Podcast"),
});


const ValidatePostActivities = async (req, res, next) => {
    const Result = ActivitySchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePatchActivities = async (req, res, next) => {
    const Result = Joi.object({
        Content: ActivitySchema.extract("Content"),
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

const ValidateGetActivities = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Type: Joi.string().valid("Discussion", "Podcast", "Event", "Feed").required(),
        EntityId: Joi.when('Type', {
            is: Joi.string().valid("Discussion", "Podcast", "Event"),
            then: Joi.string().required(),
            otherwise: Joi.any().forbidden()
        }),
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


export {
    ValidatePostActivities, ValidatePatchActivities, ValidateGetActivities
}