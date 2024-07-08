import Joi from "joi";

// Joi schema for CRM
export const AddNewCRMSchema = Joi.object({
    Name: Joi.string().required(),
    Username: Joi.string().required(),
    Password: Joi.string().required(),
    Designation:Joi.string().required(),
});

// Joi schema for Team
export const AddNewTeamSchema = Joi.object({
    Name: Joi.string().required(),
    RegionId: Joi.string().required(),
    Districts: Joi.array().items(Joi.string()).required(),
    MSIId: Joi.string().required(),
    CREIds: Joi.array().items(Joi.string()).required(),
});


// Joi schema for Region
export const AddNewPlanSchema = Joi.object({
    Title: Joi.string().required(),
    Amount: Joi.number().min(0).required(),
    ExpiryDays: Joi.number().min(0).required(),
    ApplicationsLimit: Joi.number().min(0).required(),
    IsApplicationsUnlimit: Joi.bool().required(),
    IsResumeBuilder: Joi.bool().required(),
})

// Joi schema for Region
export const AddNewRegionSchema = Joi.object({
    Name: Joi.string().required(),
    Districts: Joi.array().items(Joi.string()).required(),
    ManagerId: Joi.string().required(),
})

// Joi schema for GeoLocation
export const NatureOfJobDataSchema = Joi.object({
    Name: Joi.string().required().label("Name"),
    Image: Joi.string().required(),
});
// Joi schema for GeoLocation
export const SplashScreenImageSchema = Joi.object({
    Images: Joi.array().required().min(0),
});

// Joi schema for MULTI FIELD
export const MultiFieldSchema = Joi.object({
    FieldName: Joi.string().required().label("Field name"),
    Value: Joi.array().items(Joi.string()).min(1).required(),
});



// Joi schema for Add JobTitle
export const JobTitlesDataSchema = Joi.object({
    Name: Joi.string().required(),
    JobProfile: Joi.array().items(Joi.string().required()).min(1).required(),
    NatureOfJobs: Joi.array().items(NatureOfJobDataSchema.keys({ DocId: Joi.string().required() })).min(1).required(),
    MatchingTitles: Joi.array().items(Joi.string().empty()).required(),
});

// Joi schema for Approve JobTitle
export const ApproveJobTitlesDataSchema = Joi.object({
    Name: Joi.string().required(),
    JobProfile: Joi.array().items(Joi.string().required()).min(1).required(),
    NatureOfJobs: Joi.array().items(NatureOfJobDataSchema.keys({ DocId: Joi.string().required() })).min(1).required(),
    MatchingTitles: Joi.array().items(Joi.string().empty()).required(),
    Status: Joi.string().valid("Accepted", "Rejected",).required(),
});

export const FilesSchema = Joi.object({
    FileName: Joi.string().required(),
    FileData: Joi.array().required(),
    FileFieldName: Joi.string().valid("OrganizationPhotos1", "OrganizationPhotos2", "OrganizationPhotos3", "ProofOfServiceImg", "BusinessProofImg").required(),
})

export const CREVerifySchema = Joi.object({
    CREComment: Joi.string().required(),
})

export const MSIVerifySchema = Joi.object({
    VerifiedNote: Joi.string().required(),
})

