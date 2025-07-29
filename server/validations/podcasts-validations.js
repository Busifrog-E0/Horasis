import Joi from "joi";
import { TagsSchema } from "./tags-validations.js";

const PostPodcastSchema = Joi.object({
    PodcastName: Joi.string().required(),
    Description: Joi.string().required(),
    OrganiserId: Joi.string().required(),
    Privacy: Joi.string().valid("Public", "Private").required(),
    CoverPicture: Joi.string().required(),
    Tags: Joi.array().items(TagsSchema).default([]),
});


const PodcastCoverPhotoSchema = Joi.object({
    CoverPicture: Joi.string().required(),
});

const ValidatePostPodcast = async (req, res, next) => {
    const Result = PostPodcastSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
};

const ValidatePatchPodcastCoverPhoto = async (req, res, next) => {
    const Result = PodcastCoverPhotoSchema.validate(req.body, { stripUnknown: true });
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
    ValidatePostPodcast,
    ValidatePatchPodcastCoverPhoto
}