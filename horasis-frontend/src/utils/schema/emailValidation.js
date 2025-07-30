import Joi from "joi"
import { step3Rvalidation } from "./registration-validations/step3Regvalidation"
export const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

export const emailValidation = Joi.object({
  ContactEmail: step3Rvalidation.extract("ContactEmail"),
})
