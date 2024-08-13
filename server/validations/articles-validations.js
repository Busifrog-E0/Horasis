import Joi from 'joi';


const ArticleSchema =  Joi.object({
    Title: Joi.string().required(),
    Content: Joi.string().required(),
    UserId: Joi.string().required(),
});