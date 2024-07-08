import Joi from "joi";

export const step3validation = Joi.object({
    CVReceivingMode: Joi.array().items(Joi.string().valid('Call', 'Email', 'Whatsapp').required()).min(1).required()
        .messages({
            'array.base': 'CV receiving mode must be an array',
            'array.items': 'Each item in CV receiving mode should be a valid option (Call, Email, Whatsapp)',
            'array.min': 'At least one CV receiving mode should be selected',
            'any.required': 'CV receiving mode is required',
        }),

    ContactName: Joi.string().required().empty()
        .messages({
            'string.base': 'Contact name is required',
            'string.empty': 'Contact name cannot be empty',
            'string.max': 'Contact name should not exceed 40 characters',
            'any.required': 'Contact name is required',
        }),

    ContactDesignation: Joi.string().required().empty()
        .messages({
            'string.base': 'Contact designation is required',
            'string.empty': 'Contact designation cannot be empty',
            'string.max': 'Contact designation should not exceed 40 characters',
            'any.required': 'Contact designation is required',
        }),

    WhatsappNumber: Joi.when("CVReceivingMode", {
        "is": Joi.array().has(Joi.string().valid('Whatsapp')),
        "then": Joi.number().min(1).required()
            // .pattern(/^[0-9()+-]*[0-9]+[0-9()+-]*$/)
            .messages({
                'number.base': 'Whatsapp number must be a valid number',
                'number.min': 'Whatsapp number should be a minimum of 1',
                'any.required': 'Whatsapp number is required',
            }),
        "otherwise": Joi.any().strip(),
    }),

    ContactEmail: Joi.when("CVReceivingMode", {
        "is": Joi.array().has(Joi.string().valid('Email')),
        "then": Joi.string().required()
            .messages({
                'string.base': 'Contact email is required',
                'any.required': 'Contact email is required',
            }),
        "otherwise": Joi.any().strip(),
    }),

    PhoneNumber: Joi.when("CVReceivingMode", {
        "is": Joi.array().has(Joi.string().valid('Call')),
        "then": Joi.number().min(1).required()
            // .pattern(/^[0-9()+-]*[0-9]+[0-9()+-]*$/)
            .messages({
                'number.base': 'Phone number must be a valid number',
                'number.min': 'Phone number should be a minimum of 1',
                'any.required': 'Phone number is required',
            }),
        "otherwise": Joi.any().strip(),
    }),

    PhoneCountryCode: Joi.when("CVReceivingMode", {
        "is": Joi.array().has(Joi.string().valid('Call')),
        "then": Joi.number().min(0).required()
            .messages({
                'number.base': 'Phone country code must be a valid number',
                'number.min': 'Phone country code should be a minimum of 0',
                'any.required': 'Phone country code is required',
            }),
        "otherwise": Joi.any().strip(),
    }),

    WhatsappCountryCode: Joi.when("CVReceivingMode", {
        "is": Joi.array().has(Joi.string().valid('Whatsapp')),
        "then": Joi.number().min(0).required()
            .messages({
                'number.base': 'Whatsapp country code must be a valid number',
                'number.min': 'Whatsapp country code should be a minimum of 0',
                'any.required': 'Whatsapp country code is required',
            }),
        "otherwise": Joi.any().strip(),
    }),
    EmployerId: Joi.string().required().empty(),
});



