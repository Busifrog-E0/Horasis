import Joi from 'joi'

const ValidateGetIntervalAnalytics = async (req, res, next) => {
    const Result = Joi.object({
        Index: Joi.object({
            $lte: Joi.number().required(),
            $gte: Joi.number().required()
        }).required()//.custom((value, helpers) => {
           // if (value.$gte >= value.$lte) {
          //      //@ts-ignore
           //     return helpers.message('Start Date should be less than End Date');
          //  }
        // })
        ,
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


export {
    ValidateGetIntervalAnalytics
}