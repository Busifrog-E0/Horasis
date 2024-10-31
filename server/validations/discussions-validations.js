import Joi from "joi";

const PostDiscussionSchema = Joi.object({
    DiscussionName: Joi.string().required(),
    Description: Joi.string().required(),
    OrganiserId: Joi.string().required(),
    Brief: Joi.string().required(),
    Privacy: Joi.string().valid("Public", "Private").required(),
    CoverPicture: Joi.string().required(),
    Tags: Joi.array().items(Joi.string()).default([]),
});

const UpdatePermissionSchema = Joi.object({
    PermissionField: Joi.string().valid("CanInviteOthers", "CanPostActivity", "CanUploadPhoto", "CanCreateAlbum", "CanUploadVideo", "IsAdmin").required(),
    UserIds: Joi.array().required()
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

const ValidatePatchMemberPermission = async (req, res, next) => {
    const Result = UpdatePermissionSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    }
    else {
        req.body = Result.value;
        return next();
    }
}

const ValidatePatchRemovePermission = async (req, res, next) => {
    const Result = Joi.object({
        PermissionField: Joi.string().valid("CanInviteOthers", "CanPostActivity", "CanUploadPhoto", "CanCreateAlbum", "CanUploadVideo", "IsAdmin").required(),
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

const ValidateAddPermissionForEveryone = async (req, res, next) => {
    const Result = Joi.object({
        'MemberPermissions.CanPostActivity': Joi.boolean(),
        'MemberPermissions.CanInviteOthers': Joi.boolean(),
        'MemberPermissions.CanUploadPhoto': Joi.boolean(),
        'MemberPermissions.CanCreateAlbum': Joi.boolean(),
        'MemberPermissions.CanUploadVideo': Joi.boolean(),
    }).validate(req.body, { stripUnknown: true, convert: true });
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
    ValidatePostDiscussion,
    ValidatePatchDiscussionCoverPhoto,
    ValidatePatchMemberPermission,
    ValidatePatchRemovePermission,
    ValidateAddPermissionForEveryone
}



