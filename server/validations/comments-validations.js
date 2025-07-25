import Joi from "joi"

const CommentSchema = Joi.object({
    Content: Joi.string().required(),
    ParentId: Joi.string().required(),
    UserId: Joi.string().required(),
});

const ValidatePostComments = async (req, res, next) => {
    const Result = CommentSchema.validate(req.body, { stripUnknown: true });
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
    ValidatePostComments
}
