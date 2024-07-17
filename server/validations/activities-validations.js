import Joi from "joi"


const ActivitySchema =  Joi.object({
    Content: Joi.string().required(),
    MediaFiles: Joi.array().required(),
    Documents: Joi.array().required(),
    UserId: Joi.string().required(),
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


export {
    ValidatePostActivities,ValidatePatchActivities
}