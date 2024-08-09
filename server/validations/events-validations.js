import Joi from 'joi';

const AgendaDataSchema = Joi.object({
    Name: Joi.string().required(),
    Description: Joi.string().required(),
    Date: Joi.string().required(),
    StartTime: Joi.string().required(),
    EndTime: Joi.string().required()
});

const EventDataSchema = Joi.object({
    EventName: Joi.string().required(),
    Description: Joi.string().required(),
    Date: Joi.string().isoDate().required(),
    StartTime: Joi.string().required(),
    EndTime: Joi.string().required(),
    Agenda: Joi.array().items(AgendaDataSchema).required(),
    Privacy: Joi.string().valid('Public', 'Private').required(),
    Type: Joi.string().valid('Virtual', 'Offline').required(),
    Country: Joi.string().required(),
    NoOfMembers: Joi.number().integer().required(),
    DisplayPicture: Joi.string().uri().optional(),
    CoverPicture: Joi.string().uri().optional(),
    DocId: Joi.string().required(),
    CreatedIndex: Joi.number().integer().required()
});

const ValidatePostEvents = async (req, res, next) => {
    const Result = EventDataSchema.validate(req.body, { stripUnknown: true });
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
    ValidatePostEvents
}