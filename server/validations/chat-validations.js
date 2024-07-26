import Joi from "joi";



const PostReterieveConversationId = (req, res, next) => {
    const Result = Joi.object({
        RecieverId: Joi.string().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    req.body = Result.value;
    return next();
}


export {
    PostReterieveConversationId,
}

