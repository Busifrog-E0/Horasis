import Joi from "joi"

export const noteSchema = Joi.object({
  Note: Joi.string().required(),
})
