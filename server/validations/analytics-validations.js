import Joi from 'joi'

const ValidateGetIntervalAnalytics = async (req, res, next) => { 
    const Result = Joi.object({
        startDate: Joi.number().required(),
        endDate: Joi.number().required(),
        noOfIntervals : Joi.number().required()
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
    ValidateGetIntervalAnalytics
}