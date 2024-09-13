import Joi from "joi";

export const PostArticleSchema = Joi.object({
  ArticleName: Joi.string().required().messages({
		'string.base': 'Please enter a valid discussion name.',
		'string.empty': 'Article name cannot be empty.',
		'any.required': 'Article name is required.',
	}),
	Description: Joi.string().required().messages({
		'string.base': 'Please enter a valid description.',
		'string.empty': 'Description cannot be empty.',
		'any.required': 'Description is required.',
	}),
})