import Joi from "joi"

const QueryParametersSchema = Joi.object({
    "NextId": Joi.string().allow(''),
    "Keyword": Joi.string().allow(''),
    "Limit": Joi.number().required(),
    "OrderBy": Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string().required()),
    ).required(),
})

export {
    QueryParametersSchema
}