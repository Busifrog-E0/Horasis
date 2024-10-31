import Joi from "joi"
import { QueryParametersSchema } from "./common.js"



const ValidateGetSaves = (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Type: Joi.string().valid('Activity', 'Discussion', 'Article','Podcast').required()
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



const ValidatePostSaves = (req, res, next) => {
    const Result = Joi.object({
        Type: Joi.string().valid('Activity', 'Discussion', 'Article','Podcast').required(),
        EntityId: Joi.string().required()
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
};


export {
    ValidateGetSaves,
    ValidatePostSaves
}