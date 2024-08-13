import Joi from "joi";

const PostDiscussionSchema = Joi.object({
    DiscussionName: Joi.string().required(),
    Description: Joi.string().required(),
    OrganiserId: Joi.string().required(),
    Brief: Joi.string().required(),
    Privacy: Joi.string().valid("Public", "Private").required(),
    CoverPicture: Joi.string().required(),

});

const UpdatePermissionSchema = Joi.object({
    IsAdmin: Joi.array().items(Joi.string()),
    CanInviteOthers: Joi.array().items(Joi.string()),
    CanPostActivity: Joi.array().items(Joi.string()),
    CanUploadPhoto: Joi.array().items(Joi.string()),
    CanCreateAlbum: Joi.array().items(Joi.string()),
    CanUploadVideo: Joi.array().items(Joi.string())
}).xor('IsAdmin', 'CanInviteOthers', 'CanPostActivity', 'CanUploadPhoto', 'CanCreateAlbum', 'CanUploadVideo');

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
        'MemberPermissions.CanPostActivity': Joi.boolean().required(),
        'MemberPermissions.CanInviteOthers': Joi.boolean().required(),
        'MemberPermissions.CanUploadPhoto': Joi.boolean().required(),
        'MemberPermissions.CanCreateAlbum': Joi.boolean().required(),
        'MemberPermissions.CanUploadVideo': Joi.boolean().required(),
    }).xor('MemberPermissions.CanPostActivity', 'MemberPermissions.CanInviteOthers',
        'MemberPermissions.CanUploadPhoto', 'MemberPermissions.CanCreateAlbum', 'MemberPermissions.CanUploadVideo')
        .validate(req.body, { stripUnknown: true });
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



