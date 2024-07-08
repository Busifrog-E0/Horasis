import Joi from "joi";

export const step3Rvalidation = Joi.object({
    ContactName: Joi.string().required().empty()
        .messages({
            'string.base': 'Contact name is required',
            'string.empty': 'Contact name cannot be empty',
            'string.max': 'Contact name should not exceed 40 characters',
            'any.required': 'Contact name is required',
        }),

    PhoneNumber: Joi.number().min(1).required()
        // .pattern(/^[0-9()+-]*[0-9]+[0-9()+-]*$/)
        .messages({
            'number.base': 'Phone number must be a number',
            'number.min': 'Phone number should be a minimum of 1',
            'any.required': 'Phone number is required',
        }),

    ContactDesignation: Joi.string().required().empty()
        .messages({
            'string.base': 'Contact designation is required',
            'string.empty': 'Contact designation cannot be empty',
            'string.max': 'Contact designation should not exceed 40 characters',
            'any.required': 'Contact designation is required',
        }),

    ContactEmail: Joi.string().email({ tlds: { allow: false } }).required()
        .messages({
            'string.base': 'Contact email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Contact email is required',
        }),

    WhatsappNumber: Joi.number().min(1).required()
        // .pattern(/^[0-9()+-]*[0-9]+[0-9()+-]*$/)
        .messages({
            'number.base': 'Whatsapp number must be a number',
            'number.min': 'Whatsapp number should be a minimum of 1',
            'any.required': 'Whatsapp number is required',
        }),

    EmployerType: Joi.string().required()
        .messages({
            'string.base': 'Employer type is required',
            'any.required': 'Employer type is required',
        }),

    PhoneCountryCode: Joi.number().min(0).required()
        .messages({
            'number.base': 'Phone country code must be a number',
            'number.min': 'Phone country code should be a minimum of 0',
            'any.required': 'Phone country code is required',
        }),

    WhatsappCountryCode: Joi.number().min(0).required()
        .messages({
            'number.base': 'Whatsapp country code must be a number',
            'number.min': 'Whatsapp country code should be a minimum of 0',
            'any.required': 'Whatsapp country code is required',
        }),
});

