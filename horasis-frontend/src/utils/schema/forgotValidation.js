import Joi from 'joi'

export const forgotSchema = Joi.object({
	Email: Joi.string().email({ tlds: false }).required().messages({
		'string.base': 'Email should be a type of text',
		'string.empty': 'Email is required',
		'string.email': 'Email must be a valid email',
		'any.required': 'Email is required',
	}),
})

export const newPassSchema = Joi.object({
	Password: Joi.string()
		.min(8)
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
		.messages({
			'string.base': 'Password should be a type of text',
			'string.empty': 'Password is required',
			'string.min': 'Password must be at least 8 characters long',
			'string.pattern.base':
				'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character',
			'any.required': 'Password is required',
		}),
	ConfirmPassword: Joi.string().valid(Joi.ref('Password')).required().messages({
		'any.only': 'Passwords do not match',
		'any.required': 'Confirm Password is required',
	}),
}).with('Password', 'ConfirmPassword')
