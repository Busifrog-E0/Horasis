import Joi from "joi"


const FilesSchema = Joi.object({
    FileName: Joi.string().required(),
    FileData: Joi.array().required(),
})


const ValidatePostFilesUser = async (req, res, next) => {
    const Result = FilesSchema.keys({
        FileFieldName: Joi.string().required(),
        Type: Joi.string().valid("Events", "Discussions", "Articles","Podcasts")
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