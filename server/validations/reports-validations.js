import Joi from 'joi';
import { QueryParametersSchema } from './common.js';

/**
 * Validation schema for POST requests
 */
const ReportsSchema = Joi.object({
    Content: Joi.string().required(),
    ReportType: Joi.string().required(),
    Type: Joi.string().valid("Activity", "Comment", "Discussion", "Article", "Event", "Podcast").required(),
    UserId: Joi.string().required(),
    EntityId: Joi.string().required(),
});


/**
 * Middleware for validating POST requests
 */
const ValidatePostReports = async (req, res, next) => {
    const Result = ReportsSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    } else {
        req.body = Result.value;
        return next();
    }
};

/**
 * Middleware for validating PATCH requests
 */
const ValidatePatchReports = async (req, res, next) => {
    const Result = ReportsSchema.validate(req.body, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    } else {
        req.body = Result.value;
        return next();
    }
};

/**
 * Middleware for validating GET requests
 */
const ValidateGetReports = async (req, res, next) => {
    const Result = QueryParametersSchema.keys({
        Type: ReportsSchema.extract('Type').required(),
        ReportType: ReportsSchema.extract('ReportType').optional(),
        EntityId: ReportsSchema.extract('EntityId').optional(),
    }).validate(req.query, { stripUnknown: true });
    if (Result.error) {
        const message = Result.error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(message);
    } else {
        req.query = Result.value;
        return next();
    }
};

export {
    ValidatePostReports,
    ValidatePatchReports,
    ValidateGetReports
};