import Joi from 'joi';
import { QueryParametersSchema } from './common.js';
import { GetTags } from '../controllers/tags-controller.js';


const ArticleSchema = Joi.object({
    ArticleName: Joi.string().required(),
    Description: Joi.string().required(),
    CoverPicture: Joi.string().required(),
    AuthorId: Joi.string().required(),
    Tags : Joi.array().items(Joi.string()).default([]),
});


const ValidateGetArticles = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        AuthorId : Joi.string(),
    }).validate(req.query, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    }
    else {
        req.query = Result.value;
        return next();
    }
}


const ValidatePostArticles = async (req, res, next) => {
    const Result = ArticleSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePatchArticles = async (req, res, next) => {
    const Result = Joi.object({
        ArticleName: Joi.string(),
        Description: Joi.string(),
        Tags : ArticleSchema.extract("Tags"),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePatchArticlesCoverPicture = async (req, res, next) => {
    const Result = Joi.object({
        CoverPicture: ArticleSchema.extract("CoverPicture"),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}


export {
    ValidatePostArticles,
    ValidatePatchArticlesCoverPicture,
    ValidatePatchArticles,
    ValidateGetArticles
}