import Joi from 'joi'

export const superLoginValidation = Joi.object({
	Username: Joi.string().required().messages({
		'string.base': 'Username should be a type of text',
		'string.empty': 'Username is required',
		'any.required': 'Username is required',
	}),
	Password: Joi.string().required().messages({
		'string.base': 'Password should be a type of text',
		'string.empty': 'Password is required',
		'any.required': 'Password is required',
	}),
})
