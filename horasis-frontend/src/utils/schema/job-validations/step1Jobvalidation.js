import Joi from "joi";
export const step1validation = Joi.object({
    JobTitle: Joi.string().label("Job title").required().allow("")
        .messages({
            'string.base': 'Job title is required',
            'string.empty': 'Job title cannot be empty',
            'string.max': 'Job title should not exceed 40 characters',
            'any.required': 'Job title is required',
        }),

    // NatureOfJob: Joi.string().required().empty()
    //     .messages({
    //         'string.base': 'Nature of job is required',
    //         'string.empty': 'Nature of job cannot be empty',
    //         'string.max': 'Nature of job should not exceed 40 characters',
    //         'any.required': 'Nature of job is required',
    //     }),

    NoOfOpenings: Joi.number().min(1).required()
        .messages({
            'number.base': 'Number of openings is required',
            'number.min': 'Number of openings should be a minimum of 1',
            'any.required': 'Number of openings is required',
        }),

    // JobProfile: Joi.string().required().empty()
    //     .messages({
    //         'string.base': 'Job profile is required',
    //         'string.empty': 'Job profile cannot be empty',
    //         'string.max': 'Job profile should not exceed 40 characters',
    //         'any.required': 'Job profile is required',
    //     }),

    ExpiryDays: Joi.number().min(1).max(30).required()
        .messages({
            'number.base': 'Expiry days is required',
            'number.min': 'Expiry days should be a minimum of 1',
            'number.max': 'Expiry days should not exceed 30',
            'any.required': 'Expiry days is required',
        }),

    Type: Joi.string().required().empty()
        .messages({
            'string.base': 'Type is required',
            'string.empty': 'Type cannot be empty',
            'string.max': 'Type should not exceed 40 characters',
            'any.required': 'Type is required',
        }),

    VacancyFor: Joi.string().required().empty()
        .messages({
            'string.base': 'Vacancy for is required',
            'string.empty': 'Vacancy for cannot be empty',
            'string.max': 'Vacancy for should not exceed 40 characters',
            'any.required': 'Vacancy for is required',
        }),

    RecruitmentFor: Joi.when("VacancyFor", {
        "is": "For other Company",
        "then": Joi.string()
            .messages({
                'string.base': 'Recruitment for is required',
                'string.max': 'Recruitment for should not exceed 40 characters',
            }),
        "otherwise": Joi.any().strip(),
    }),

    RecruitmentFee: Joi.when("VacancyFor", {
        "is": "For other Company",
        "then": Joi.boolean().required()
            .messages({
                'boolean.base': 'Recruitment fee must be a boolean',
                'any.required': 'Recruitment fee is required',
            }),
        "otherwise": Joi.any().strip(),
    }),

    MinSalary: Joi.number().min(1).required()
        .messages({
            'number.base': 'Minimum salary is required',
            'number.min': 'Minimum salary should be a minimum of 1',
            'any.required': 'Minimum salary is required',
        }),

    MaxSalary: Joi.number().min(Joi.ref("MinSalary")).required()
        .messages({
            'number.base': 'Maximum salary is required',
            'number.min': 'Maximum salary should be greater than or equal to minimum salary',
            'any.required': 'Maximum salary is required',
        }),

    SalaryType: Joi.string().required().empty()
        .messages({
            'string.base': 'Salary type is required',
            'string.empty': 'Salary type cannot be empty',
            'string.max': 'Salary type should not exceed 40 characters',
            'any.required': 'Salary type is required',
        }),

    IncentiveScheme: Joi.boolean().required()
        .messages({
            'boolean.base': 'Incentive scheme must be a boolean',
            'any.required': 'Incentive scheme is required',
        }),

    AvarageEarningPotential: Joi.number().min(1).required()
        .messages({
            'number.base': 'Average earning potential is required',
            'number.min': 'Average earning potential should be a minimum of 1',
            'any.required': 'Average earning potential is required',
        }),

    AdditionalBenefits: Joi.array().items(Joi.string().empty()).min(0)
        .messages({
            'array.base': 'Additional benefits are required',
            'array.items': 'Each item in additional benefits should be a string with a maximum length of 40 characters',
            'array.min': 'Additional benefits should have at least one item',
            'any.required': 'Additional benefits is required',
        }),

    UnderReviewAdditionalBenefits: Joi.array().items(Joi.string().empty())
        .messages({
            'array.base': 'Under review additional benefits are required',
            'array.items': 'Each item in under review additional benefits should be a string with a maximum length of 40 characters',
        }),
    UnderReviewProfessionalSkills: Joi.array().items(Joi.string().empty())
        .messages({
            'array.base': 'Under review professional skills are required',
            'array.items': 'Each item in under review professional skills should be a string with a maximum length of 40 characters',
        }),
    UnderReviewSkills: Joi.array().items(Joi.string().empty())
        .messages({
            'array.base': 'Under review skills are required',
            'array.items': 'Each item in under review skills should be a string with a maximum length of 40 characters',
        }),

    SalaryCurrency: Joi.string().required().empty()
        .messages({
            'string.base': 'Salary currency is required',
            'string.empty': 'Salary currency cannot be empty',
            'any.required': 'Salary currency is required',
        }),
});
