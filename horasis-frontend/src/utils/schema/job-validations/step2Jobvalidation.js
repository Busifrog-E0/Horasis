import Joi from "joi";
import { AddressDetailsSchema, GeoLocationSchema, LocationDetailsSchema } from "../common-validations";

export const step2validation = Joi.object({
    JobLocations: Joi.array().items(GeoLocationSchema).min(1).required()
        .messages({
            'array.base': 'Job locations are required',
            'array.items': 'Each item in job locations should be a valid GeoLocation',
            'array.min': 'Job locations should have at least one item',
            'any.required': 'Job locations is required',
        }),
    RestrictCountries: Joi.string().required().empty()
        .messages({
            'string.base': 'This field is required',
            'string.empty': 'This field cannot be empty',
            'string.max': 'This field should not exceed 40 characters',
            'any.required': 'This field is required',
        }),
    PreferredCountries: Joi.when("RestrictCountries", {
        "is": "No",
        "then": Joi.array().required()
            .messages({
                'any.required': 'This field is required',
            }),
    }),
    SearchRadius: Joi.number().min(20).required()
        .messages({
            'number.base': 'Search radius is required',
            'number.min': 'Search radius should be a minimum of 20',
            'any.required': 'Search radius is required',
        }),

    WorkFromHome: Joi.boolean().required()
        .messages({
            'boolean.base': 'Work from home is required',
            'any.required': 'Work from home is required',
        }),

    FieldWork: Joi.boolean().required()
        .messages({
            'boolean.base': 'Field work is required',
            'any.required': 'Field work is required',
        }),

    WalkInInterview: Joi.boolean().required()
        .messages({
            'boolean.base': 'Walk-in interview is required',
            'any.required': 'Walk-in interview is required',
        }),

    InterviewDetails: Joi.when("WalkInInterview", {
        "is": true,
        "then": Joi.object({
            StartDate: Joi.number().required().empty()
                .messages({
                    'number.base': 'Interview start date is required',
                    'any.required': 'Interview start date is required',
                }),

            EndDate: Joi.number().required().empty().greater(Joi.ref('StartDate'))
                .messages({
                    'number.base': 'Interview end date is required',
                    'any.required': 'Interview end date is required',
                    'number.greater': 'Interview end date should be greater than start date',
                }),

            InterviewLocation: AddressDetailsSchema.required().empty().disallow({})
                .messages({
                    'object.base': 'Interview location details are required',
                    'any.required': 'Interview location details are required',
                }),
        }),
        "otherwise": Joi.any().strip(),
    }),
});

