import Joi from "joi"


const ValidateTranslation = (req, res, next) => {
    const Result = Joi.object({
        TargetLanguage: Joi.string().required(),
        Type: Joi.string().valid('Activity', 'Discussion', 'Article', 'Comment', 'Event','Podcast').required(),
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
}


export {
    ValidateTranslation
}