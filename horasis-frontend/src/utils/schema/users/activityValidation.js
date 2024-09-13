import Joi from 'joi'

export const activityValidation = Joi.object({
    Content: Joi.string().required().messages({
        'string.base': 'Please enter valid text for the content.',
        'string.empty': 'Content cannot be empty.',
        'any.required': 'Content is required.'
    }),
    MediaFiles: Joi.array().required().messages({
        'array.base': 'Please provide a list of media files.',
        'any.required': 'Media files are required.'
    }),
    Documents: Joi.array().required().messages({
        'array.base': 'Please provide a list of documents.',
        'any.required': 'Documents are required.'
    }),
    UserId: Joi.string().required().messages({
        'string.base': 'Please enter a valid user ID.',
        'string.empty': 'User ID cannot be empty.',
        'any.required': 'User ID is required.'
    }),
});
