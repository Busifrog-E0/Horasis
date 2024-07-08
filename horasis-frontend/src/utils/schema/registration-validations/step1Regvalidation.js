import Joi from "joi";
import { AddressDetailsSchema } from "../common-validations";

export const step1Rvalidation = Joi.object({
    OrganizationName: Joi.string().required().empty()
        .messages({
            'string.base': 'Organization name is required',
            'string.empty': 'Organization name cannot be empty',
            'string.max': 'Organization name should not exceed 40 characters',
            'any.required': 'Organization name is required',
        }),

    About: Joi.string().min(0).max(4000)
        .messages({
            'string.base': 'About is required',
            'string.max': 'About should not exceed 4000 characters',
            'any.required': 'About is required',
        }),

    RegistrationNumber: Joi.string().allow("").required().empty()
        .messages({
            'string.base': 'Registration number is required',
            'string.max': 'Registration number should not exceed 40 characters',
            'any.required': 'Registration number is required',
        }),

    Industry: Joi.string().allow("").required().empty()
        .messages({
            'string.base': 'Industry is required',
            'string.max': 'Industry should not exceed 40 characters',
            'any.required': 'Industry is required',
        }),
    Address: AddressDetailsSchema,
})
