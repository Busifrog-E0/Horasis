import Joi from 'joi'

export const SendNotificationSchema = Joi.object({
	Description: Joi.string().required().messages({
		'string.base': 'Please enter a valid description.',
		'string.empty': 'Description cannot be empty.',
		'any.required': 'Description is required.',
	}),
})
