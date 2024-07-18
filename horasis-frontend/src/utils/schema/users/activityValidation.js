import Joi from 'joi'

export const activityValidation = Joi.object({
    Content: Joi.string().required(),
    MediaFiles: Joi.array().required(),
    Documents: Joi.array().required(),
    UserId: Joi.string().required(),
});
