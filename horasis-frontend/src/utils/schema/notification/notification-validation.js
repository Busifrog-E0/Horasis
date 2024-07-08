import Joi from "joi"

export const notificationValidation = Joi.object({
  Title: Joi.string().required(),
  Content: Joi.string().required(),
})
