import Joi from "joi"

const TagsSchema = Joi.object({
    TagName: Joi.string().required(),
    DocId : Joi.string().required()
})

const ValidatePostTags = async (req, res, next) => {
    const Result = Joi.object({
        TagName: Joi.string().required(),
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
    ValidatePostTags,
    TagsSchema
}