import Joi from "joi"


const ActivitySchema =  Joi.object({
    Content: Joi.string().required(),
    Mentions: Joi.array().items(Joi.string()).required(),
    Attachments: Joi.array().items(Joi.string().uri()).required(),
    Type: Joi.string().valid('Feed', 'Event', 'Discussion').required(),
    ParentId: Joi.string().required()
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
        Mentions: ActivitySchema.extract("Mentions"),
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