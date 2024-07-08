import Joi from "joi";

export const step4Rvalidation = Joi.object({
    BusinessProofImg: Joi.string().required().allow(""),
    ProofOfServiceImg: Joi.string().required().allow(""),
    OrganizationPhotos: Joi.array().min(0).max(3).items(Joi.string().allow("")).required(),

    BusinessProofImgType: Joi.string().when('BusinessProofImg', {
        is: Joi.string().required().not('').allow(null),
        then: Joi.string().required(),
        otherwise: Joi.string()
    }),

    ProofOfServiceImgType: Joi.string().when('ProofOfServiceImg', {
        is: Joi.string().required().not('').allow(null),
        then: Joi.string().required(),
        otherwise: Joi.string()
    }),
});