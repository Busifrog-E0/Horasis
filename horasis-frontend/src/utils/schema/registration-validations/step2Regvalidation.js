import Joi from "joi";
export const step2Rvalidation = Joi.object({
    YearOfLaunch: Joi.number().min(1).required()
        .messages({
            'number.base': 'Year of launch must be a number',
            'number.min': 'Year of launch should be a minimum of 1',
            'any.required': 'Year of launch is required',
        }),

    Website: Joi.string().allow("").required().empty()
        .messages({
            'string.base': 'Website is required',
            'string.empty': 'Website cannot be empty',
            'any.required': 'Website is required',
        }),

    MonthlyTurnover: Joi.number().min(1).required()
        .messages({
            'number.base': 'Monthly turnover must be a number',
            'number.min': 'Monthly turnover should be a minimum of 1',
            'any.required': 'Monthly turnover is required',
        }),

    NoOfEmployees: Joi.number().min(1).required()
        .messages({
            'number.base': 'Number of employees must be a number',
            'number.min': 'Number of employees should be a minimum of 1',
            'any.required': 'Number of employees is required',
        }),

    NoOfBranches: Joi.number().min(1).required()
        .messages({
            'number.base': 'Number of branches must be a number',
            'number.min': 'Number of branches should be a minimum of 1',
            'any.required': 'Number of branches is required',
        }),

    BranchLocation: Joi.string().required().empty()
        .messages({
            'string.base': 'Branch location is required',
            'string.max': 'Branch location should not exceed 40 characters',
            'any.required': 'Branch location is required',
        }),
});
