import Joi from "joi";

const PostDiscussionSchema = Joi.object({
    DiscussionName: Joi.string().required(),
    Description: Joi.string().required(),
    Brief: Joi.string().required(),
    Privacy: Joi.string().valid("Public", "Private").required(),
    CoverPicture: Joi.string().required(),

});

const DiscussionCoverPhotoSchema = Joi.object({
    CoverPicture: Joi.string().required(),
});

const ValidatePostDiscussion = async (req, res, next) => {
    const Result = PostDiscussionSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
};

const ValidatePatchDiscussionCoverPhoto = async (req, res, next) => {
    const Result = DiscussionCoverPhotoSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
};

export {
    ValidatePostDiscussion,
    ValidatePatchDiscussionCoverPhoto
}



