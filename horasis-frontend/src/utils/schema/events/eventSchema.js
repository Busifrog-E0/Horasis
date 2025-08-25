import Joi from 'joi'
import moment from 'moment'

export const agendaSchema = Joi.object({
	Name: Joi.string().required().messages({
		'string.empty': 'Please provide the name of the agenda item.',
		'any.required': 'The agenda item name is required.',
	}),
	Description: Joi.string().required().messages({
		'string.empty': 'Please provide a description for the agenda item.',
		'any.required': 'The agenda item description is required.',
	}),
	StartTime: Joi.number().integer().required().messages({
		'number.base': 'Please provide a valid timestamp for the agenda item start time.',
		'any.required': 'The agenda item start time is required.',
	}),
	EndTime: Joi.number().integer().required().messages({
		'number.base': 'Please provide a valid timestamp for the agenda item end time.',
		'any.required': 'The agenda item end time is required.',
	}),
	Location: Joi.string().required().messages({
		'string.empty': 'Please provide the location where the agenda is held.',
		'any.required': 'The location is required.',
	}),
})

export const eventSchema = Joi.object({
	OrganiserId: Joi.string().required().messages({
		'string.empty': 'Please provide the Organizer ID.',
		'any.required': 'The Organizer ID is required.',
	}),

	EventName: Joi.string().required().messages({
		'string.empty': 'Please provide the name of the event.',
		'any.required': 'The event name is required.',
	}),

	Description: Joi.string().required().messages({
		'string.empty': 'Please provide a description for the event.',
		'any.required': 'The event description is required.',
	}),

	Date: Joi.number().integer().required().messages({
		'number.base': 'Please provide a valid Event Date',
		'any.required': 'The agenda item date is required.',
	}),

	StartTime: Joi.number().integer().required().messages({
		'any.required': 'The event start time is required.',
	}),

	EndTime: Joi.number().integer().required().messages({
		'any.required': 'The event end time is required.',
	}),

	Agenda: Joi.array().items(agendaSchema).required().messages({
		'array.base': 'The agenda must be a list of items.',
		'any.required': 'Please provide at least one agenda item.',
	}),

	Privacy: Joi.string().valid('Public', 'Private').required().messages({
		'any.only': 'Please select either Public or Private for the privacy setting.',
		'any.required': 'The privacy setting is required.',
	}),

	Type: Joi.string().valid('Offline', 'Virtual').required().messages({
		'any.only': 'Please select either Offline or Virtual for the event type.',
		'any.required': 'The event type is required.',
	}),

	Country: Joi.string().required().messages({
		'string.empty': 'Please provide the country where the event is held.',
		'any.required': 'The country is required.',
	}),

	Location: Joi.string().required().messages({
		'string.empty': 'Please provide the location where the event is held.',
		'any.required': 'The location is required.',
	}),

	// DisplayPicture: Joi.string().uri().required().messages({
	// 	'string.uri': 'Please provide a valid URL for the display picture.',
	// 	'any.required': 'The display picture URL is required.',
	// }),

	// CoverPicture: Joi.string().uri().required().messages({
	// 	'string.uri': 'Please provide a valid URL for the cover picture.',
	// 	'any.required': 'The cover picture URL is required.',
	// }),

	HasDiscussion: Joi.boolean().required().messages({
		'boolean.base': 'Please indicate whether the event includes a discussion.',
		'any.required': 'The discussion field is required.',
	}),

	Capacity: Joi.number().min(1).messages({
		'number.base': 'Please enter a valid number for the seat limit.',
		'any.required': 'The seat limit is required.',
		'number.min': 'The seat limit must be at least 1.',
	}),
	EnableSeatLimit: Joi.boolean().optional(),
})
	.custom((value, helpers) => {
		const currentTime = moment().valueOf()

		// Check that StartTime is less than EndTime.
		if (value.StartTime >= value.EndTime) {
			const error = helpers.error('startTime.lessThanEndTime')
			error.path = ['StartTime']
			return error
		}

		// Check that Date is in the future.
		if (value.Date <= currentTime) {
			const error = helpers.error('date.future')
			error.path = ['Date']
			return error
		}

		// Check that StartTime is in the future.
		if (value.StartTime <= currentTime) {
			const error = helpers.error('startTime.future')
			error.path = ['StartTime']
			return error
		}

		return value
	})
	.messages({
		'startTime.lessThanEndTime': 'Start Time must be less than End Time',
		'date.future': 'Date must be a future date',
		'startTime.future': 'Start Time must be in the future',
	})
