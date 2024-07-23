import Joi from 'joi'

export const PostDiscussionSchema = Joi.object({
	DiscussionName: Joi.string().required().messages({
		'string.base': 'Please enter a valid discussion name.',
		'string.empty': 'Discussion name cannot be empty.',
		'any.required': 'Discussion name is required.',
	}),
	Description: Joi.string().required().messages({
		'string.base': 'Please enter a valid description.',
		'string.empty': 'Description cannot be empty.',
		'any.required': 'Description is required.',
	}),
	Brief: Joi.string().required().messages({
		'string.base': 'Please enter a valid brief.',
		'string.empty': 'Brief cannot be empty.',
		'any.required': 'Brief is required.',
	}),
	Privacy: Joi.string().valid('Public', 'Private').required().messages({
		'string.base': 'Please select a privacy option.',
		'string.empty': 'Privacy cannot be empty.',
		'any.only': 'Privacy must be either Public or Private.',
		'any.required': 'Privacy is required.',
	}),
})
