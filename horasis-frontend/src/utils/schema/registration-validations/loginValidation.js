import Joi from "joi";

export const loginValidation = Joi.object({
    Username: Joi.string().required(),
    Password: Joi.string().required(),
})
