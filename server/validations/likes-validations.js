import Joi from "joi"
const ValidatePostLikes = (req, res, next) => {
    const Result = Joi.object({
        Type: Joi.string().valid("Activity", "Comment", "Article").required(),
        EntityId: Joi.string().required()
    }).validate(req.body, { stripUnknown: true, convert: true });
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
    ValidatePostLikes
}