import e from "express";
import { QueryParametersSchema } from "../validations/common.js";

const AddUpdatedBy = (ChangeType, ReadOneFromCollection, ParamsId) => async (req, res, next) => {

    if (!req.user) {
        return next();
    }

    const UpdatedBy = { "Role": req.user.Role, "UserId": req.user.UserId, ChangeType };
    req.body.UpdatedBy = [];

    if (ParamsId) {
        const data = await ReadOneFromCollection(req.params[ParamsId]);
        if (data !== null && data.UpdatedBy) {
            req.body.UpdatedBy = data.UpdatedBy;
        }
    }

    req.body.UpdatedBy.push(UpdatedBy);
    return next();
}

/**
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {e.NextFunction} next 
 */
const ValidateGetEntity = async (req, res, next) => {


    const { error, value } = QueryParametersSchema.validate(req.query, { "convert": true, "stripUnknown": true });
    if (error) {
        const message = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json(error);
    }

    req.query = value;
    return next();
}


const QueryParameterFormatting = (req, res, next) => {
    const returnObject = {
        NextId: req.query.NextId,
        Limit: req.query.Limit,
        Keyword: req.query.Keyword,
        OrderBy: OrderByFormatting(req.query.OrderBy),
        Filter: {},
    }
    delete req.query.NextId;
    delete req.query.Limit;
    delete req.query.OrderBy;
    delete req.query.Keyword;


    for (const key in req.query) {
        if (Object.hasOwnProperty.call(req.query, key)) {
            const element = req.query[key];
            if (Array.isArray(element)) {
                returnObject["Filter"][key] = { "$in": element };
            }
            else {
                returnObject["Filter"][key] = element;
            }
        }
    }

    req.query = returnObject;

    return next();

}

/**
 * 
 * @param {string|Array<string>} OrderBy 
 * @returns {object}
 */
const OrderByFormatting = (OrderBy = []) => {
    const returnObject = {};
    if (!Array.isArray(OrderBy)) {
        OrderBy = [OrderBy];
    }

    for (let index = 0; index < OrderBy.length; index++) {
        const element = OrderBy[index];
        if (element[0] === "-") {
            returnObject[element.substring(1)] = "asc";
        }
        else {
            returnObject[element] = "desc";
        }
    }
    return returnObject;
}

const SetUserIdInQuery = (req, res, next) => {
    req.query.UserId = req.user.UserId;
    return next();
}


const SetActiveInQueryIfUser = (req, res, next) => {
    if (req.user.Role === "User") {
        req.query.Active = true;
    }
    return next();
}


const CheckSameUser = (req, res, next) => {
    if (req.user.UserId !== req.params.UserId) {
        return res.status(402).json("No Access")
    }
    return next();
}

const CheckSameUserInBody = (req, res, next) => {
    if (req.user.UserId !== req.body.UserId) {
        return res.status(402).json("No Access")
    }
    return next();
}


const CheckSameOrganizerInBody = (req, res, next) => {
    if (req.user.UserId !== req.body.OrganiserId) {
        return res.status(402).json("No Access")
    }
    return next();
}


const CheckSameUserInEntity = (ReadFn, FieldName) => async (req, res, next) => {
    const Entity = await ReadFn(req.params[FieldName]);
    const CheckId = (Entity.UserId ?? Entity.OrganiserId) ?? Entity.AuthorId;
    if (CheckId !== req.user.UserId) {
        return res.status(402).json("No Access")
    }
    return next();
}

const EntityTypes = {
    discussions: "Discussion",
    events: "Event",
    activities: "Activity"
}

export {
    AddUpdatedBy, ValidateGetEntity, QueryParameterFormatting,
    SetUserIdInQuery, CheckSameUser, SetActiveInQueryIfUser, EntityTypes,
    CheckSameUserInBody, CheckSameUserInEntity, CheckSameOrganizerInBody
}