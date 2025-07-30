import Joi from 'joi'

export const commentValidation = Joi.object({
	Content: Joi.string().required().messages({
		'string.base': 'Please enter valid text for the content.',
		'string.empty': 'Content cannot be empty.',
		'any.required': 'Content is required.',
	}),
	UserId: Joi.string().required().messages({
		'string.base': 'Please enter a valid user ID.',
		'string.empty': 'User ID cannot be empty.',
		'any.required': 'User ID is required.',
	}),
	ParentId: Joi.string().required().messages({
		'string.base': 'Please enter a valid user ID.',
		'string.empty': 'User ID cannot be empty.',
		'any.required': 'User ID is required.',
	}),
})
