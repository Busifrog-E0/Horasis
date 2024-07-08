import Joi from "joi";

// Joi schema for Job Data - mainly for create and add
export const step5validation = Joi.object({
    Description: Joi.string().min(0)
        .messages({
            'string.base': 'Description is required',
            'any.required': 'Description is required',
        }),
});
