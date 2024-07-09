import Joi from 'joi'

export const updateValidation = Joi.object({
  FullName: Joi.string().required().messages({
    'string.base': 'Full Name should be a type of text',
    'string.empty': 'Full Name is required',
    'any.required': 'Full Name is required',
  }),
  Username: Joi.string().required().messages({
    'string.base': 'Username should be a type of text',
    'string.empty': 'Username is required',
    'any.required': 'Username is required',
  }),
  Country: Joi.string().required().messages({
    'string.base': 'Country should be a type of text',
    'string.empty': 'Country is required',
    'any.required': 'Country is required',
  }),
  JobTitle: Joi.string().required().messages({
    'string.base': 'Job Title should be a type of text',
    'string.empty': 'Job Title is required',
    'any.required': 'Job Title is required',
  }),
  CompanyName: Joi.string().required().messages({
    'string.base': 'Company Name should be a type of text',
    'string.empty': 'Company Name is required',
    'any.required': 'Company Name is required',
  }),
  About: Joi.string().max(500).required().messages({
    'string.base': 'About should be a type of text',
    'string.max': 'About must be at most 500 characters long',
    'string.empty': 'About is required',
    'any.required': 'About is required',
  }),
}).with('Password', 'ConfirmPassword')
