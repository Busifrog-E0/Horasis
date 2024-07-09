import Joi from 'joi'

const ValidateFollow = async (req, res, next) => {
    const Result = Joi.object({
        FolloweeId : Joi.string().email().required(),
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
    ValidateFollow
}