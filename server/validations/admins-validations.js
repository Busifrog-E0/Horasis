import Joi from "joi";

const ValidateAdmin = async (req, res, next) => {
    const Result = Joi.object({
        Username: Joi.string().required(),
        Password: Joi.string().required()
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePatchUserRoles = async (req, res, next) => { 
    const Result = Joi.object({
        UserId: Joi.string().required(),
    }).validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

export {
    ValidateAdmin, ValidatePatchUserRoles
}
