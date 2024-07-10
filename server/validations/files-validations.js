import Joi from "joi"


const FilesSchema = Joi.object({
    FileName: Joi.string().required(),
    FileType: Joi.string().required(),//.valid("image/jpeg", "application/pdf"),
    FileData: Joi.array().required(),
})


const ValidatePostFilesUser = async (req, res, next) => {
    const Result = FilesSchema.keys({
        FileFieldName: Joi.string().valid("ProfilePicture", "CoverPicture").required(),
    }).validate(req.body, { allowUnknown: true });
    if (Result.error) {
        return res.status(400).json(Result.error.details)
    }
    else {
        req.body = Result.value;
        return next();
    }

}



const ValidatePostFilesAdmin = async (req, res, next) => {
    const Result = FilesSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        return res.status(400).json(Result.error.details)
    }
    else {
        req.body = Result.value;
        return next();
    }

}


export {
    ValidatePostFilesUser,
    ValidatePostFilesAdmin,
}