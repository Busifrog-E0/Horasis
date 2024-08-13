import Joi from 'joi';


const ArticleSchema = Joi.object({
    ArticleName: Joi.string().required(),
    Description: Joi.string().required(),
    CoverPhoto: Joi.string().required(),
    AuthorId: Joi.string().required(),
});


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
        CoverPhoto: ArticleSchema.extract("CoverPhoto"),
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
    ValidatePatchArticles
}