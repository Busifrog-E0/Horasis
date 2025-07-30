import Joi from 'joi'

export const loginValidation = Joi.object({
  Email: Joi.string().email({ tlds: false }).required().messages({
    'string.base': 'Email should be a type of text',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  Password: Joi.string().required().messages({
    'string.base': 'Password should be a type of text',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
})
