import Joi from 'joi'
import moment from 'moment';

const ValidateGetIntervalAnalytics = async (req, res, next) => {
    const Result = Joi.object({
        Index: Joi.object({
            $lte: Joi.number().required(),
            $gte: Joi.number().required()
        }).required().custom((value, helpers) => {
            if (value.$gte >= value.$lte) {
                //@ts-ignore
                return helpers.message('Start Date should be less than End Date');
            }
            if (value.$lte > moment().endOf('day').valueOf()) {
                //@ts-ignore
                return helpers.message("End Date should be less than current date");
            }
            return value;
        }),
        NoOfIntervals: Joi.number().required()
    }).validate(req.query, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    } else {
        req.query = Result.value;
        return next();
    }
}

const ValidateGetUserBreakdownAnalytics = async (req, res, next) => {
    const Result = Joi.object({
        Country: Joi.string()
    }).validate(req.query, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    } else {
        req.query = Result.value;
        return next();
    }
}

const ValidateGetEngagement = async (req, res, next) => {
    const Result = Joi.object({
        Type: Joi.string().valid("Discussion", "Podcast", "Event",'Article').required(),
        Country: Joi.string()
    }).validate(req.query, { stripUnknown: true, convert: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    } else {
        req.query = Result.value;
        return next();
    }
}


export {
    ValidateGetIntervalAnalytics,
    ValidateGetUserBreakdownAnalytics,
    ValidateGetEngagement
}