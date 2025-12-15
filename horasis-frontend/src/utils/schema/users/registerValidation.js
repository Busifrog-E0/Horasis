import Joi from 'joi'

export const registerValidation = Joi.object({
	FullName: Joi.string().required().messages({
		'string.base': 'Full Name should be a type of text',
		'string.empty': 'Full Name is required',
		'any.required': 'Full Name is required',
	}),
	Username: Joi.string().required().min(3).messages({
		'string.base': 'Username should be a type of text',
		'string.empty': 'Username is required',
		'string.min': 'Username should be at least 3 characters long',
		'any.required': 'Username is required',
	}),
	Email: Joi.string().email({ tlds: false }).required().messages({
		'string.base': 'Email should be a type of text',
		'string.empty': 'Email is required',
		'string.email': 'Email must be a valid email',
		'any.required': 'Email is required',
	}),
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
	Country: Joi.string().required().messages({
		'string.base': 'Country should be a type of text',
		'string.empty': 'Country is required',
		'any.required': 'Country is required',
	}),
	City: Joi.string().required().messages({
		'string.base': 'City should be a type of text',
		'string.empty': 'City is required',
		'any.required': 'City is required',
	}),
	JobTitle: Joi.string().required().messages({
		'string.base': 'Job Title should be a type of text',
		'string.empty': 'Job Title is required',
		'any.required': 'Job Title is required',
	}),
	Industry: Joi.string().required().messages({
		'string.base': 'Industry should be a type of text',
		'string.empty': 'Industry is required',
		'any.required': 'Industry is required',
	}),
	CompanyName: Joi.string().required().messages({
		'string.base': 'Company Name should be a type of text',
		'string.empty': 'Company Name is required',
		'any.required': 'Company Name is required',
	}),
	About: Joi.string().max(1000).allow('').messages({
		'string.base': 'About should be a type of text',
		'string.max': 'About must be at most 1000 characters long',
		'string.empty': 'About is required',
		'any.required': 'About is required',
	}),
	IsPrivate: Joi.boolean().optional().messages({
		'any.required': 'Please specify if this should be private or not.',
		'boolean.base': 'Invalid input! The private field must be either true or false.',
	}),
}).with('Password', 'ConfirmPassword')
