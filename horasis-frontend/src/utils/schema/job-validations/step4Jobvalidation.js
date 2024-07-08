import Joi from "joi";

export const step4validation = Joi.object({
    Qualification: Joi.string().required().empty()
        .messages({
            'string.base': 'Qualification is required',
            'string.empty': 'Qualification cannot be empty',
            'string.max': 'Qualification should not exceed 40 characters',
            'any.required': 'Qualification is required',
        }),

    ProfessionalSkills: Joi.array().items(Joi.string().empty()).min(0)
        .messages({
            'array.base': 'Professional skills are required',
            'array.items': 'Each item in skills should be a string with a maximum length of 40 characters',
            'array.min': 'Professional skills should have at least one item',
        }),

    Course: Joi.array().items(Joi.string().empty()).min(0),

    SubjectSpecialization: Joi.array().items(Joi.string().empty()).min(0),
    Skills: Joi.array().items(Joi.string().empty()).min(0)
        .messages({
            'array.base': 'Skills are required',
            'array.items': 'Each item in skills should be a string with a maximum length of 40 characters',
            'array.min': 'Skills should have at least one item',
        }),

    EnglishKnowledge: Joi.string().empty()
        .messages({
            'string.base': 'English knowledge is required',
            'string.max': 'English knowledge should not exceed 40 characters',
        }),

    WorkExperience: Joi.object({
        Years: Joi.number().integer().min(0).required()
            .messages({
                'number.base': 'Years of work experience must be a valid number',
                'number.integer': 'Years of work experience must be an integer',
                'number.min': 'Years of work experience should be a minimum of 0',
                'any.required': 'Years of work experience is required',
            }),

        Months: Joi.number().integer().min(0).required()
            .messages({
                'number.base': 'Months of work experience must be a valid number',
                'number.integer': 'Months of work experience must be an integer',
                'number.min': 'Months of work experience should be a minimum of 0',
                'any.required': 'Months of work experience is required',
            }),
    }),

    CanFreshersApply: Joi.boolean().required()
        .messages({
            'boolean.base': 'Can freshers apply is required',
            'any.required': 'Can freshers apply is required',
        }),

    PreferredCandidates: Joi.array().items(Joi.string().empty()).min(1)
        .messages({
            'array.base': 'Preferred candidates are required',
            'array.items': 'Each item in preferred candidates should be a string with a maximum length of 40 characters',
            'array.min': 'Preferred candidates should have at least one item',
        }),

    Assets: Joi.array().items(Joi.string().empty()).min(0)
        .messages({
            'array.base': 'Assets are required',
            'array.items': 'Each item in assets should be a string with a maximum length of 40 characters',
        }),

    UnderReviewAssets: Joi.array().items(Joi.string().empty())
        .messages({
            'array.base': 'Under review assets are required',
            'array.items': 'Each item in under review assets should be a string with a maximum length of 40 characters',
        }),
});
