import Joi from "joi"

const QueryParametersSchema = Joi.object({
    "NextId": Joi.string().allow('').trim(),
    "Keyword": Joi.string().allow('').trim(),
    "Limit": Joi.number().required(),
    "OrderBy": Joi.alternatives().try(
        Joi.string().trim(),
        Joi.array().items(Joi.string().required().trim()),
    ).required(),
})

export {
    QueryParametersSchema
}