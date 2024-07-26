import logger from 'harislogger';

import dbFile from './db.config.js';
const db = dbFile.getClient().db("Horasis");
import { ObjectId } from 'mongodb';
import moment from "moment-timezone";


/**
 * @param {string} collectionName
 * @param {object} data
 * @param {string | number | ObjectId | import("bson").ObjectIdLike | Uint8Array | undefined} docName
 * @returns {Promise<string>}
 */
async function Create(collectionName, data, docName = undefined, index = true) {
    return new Promise(async (resolve, reject) => {
        try {
            data.CreatedIndex = moment().valueOf();
            if (data.Index === undefined && index) {
                data.Index = `${Date.now()}`;
            }
            if (docName !== undefined) {
                const done = await db.collection(collectionName).insertOne({ ...data, "_id": new ObjectId(docName) });
                resolve(done.insertedId.toString());
            } else {
                const done = await db.collection(collectionName).insertOne(data);
                resolve(done.insertedId.toString());
            }
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}

/**
 * @param {string} collectionName
 * @param {Array<string>} operation
 * @param {{ LastUpdated: number | undefined; }|object} data
 * @param {object} dataSets
 * @param {string | number | ObjectId | import("bson").ObjectIdLike | Uint8Array | undefined} docName
 */
async function Update(collectionName, data, docName, operation = ["$set"], LastUpdated = true, ...dataSets) {
    return new Promise(async (resolve, reject) => {
        try {

            if (data.LastUpdated === undefined && LastUpdated) {
                data.LastUpdated = `${Date.now()}`;
            }
            delete data._id;
            const OperationObject = { [operation[0]]: data }
            for (let index = 1; index < operation.length; index++) {
                OperationObject[operation[index]] = dataSets[index - 1];
            }
            await db.collection(collectionName).updateOne({ "_id": new ObjectId(docName) }, OperationObject);
            resolve(true);
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}

/**
 * @param {string} collectionName
 * @param {object} data
 * @param {object} filter
 * @param {object} dataSets
 * @param {Array<string>} operation
 * 
 */
async function UpdateMany(collectionName, data, filter, operation = ["$set"], ...dataSets) {
    return new Promise(async (resolve, reject) => {
        try {
            const OperationObject = { [operation[0]]: data }
            for (let index = 1; index < operation.length; index++) {
                OperationObject[operation[index]] = dataSets[index - 1];
            }
            await db.collection(collectionName).updateMany(filter, data);
            resolve(true);
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}

/**
 * @param {string} collectionName
 * @param {string | number | ObjectId | import("bson").ObjectIdLike | Uint8Array | undefined} docName
 */
async function Delete(collectionName, docName) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection(collectionName).deleteOne({ "_id": new ObjectId(docName) });
            resolve(true);
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}

/**
 * @param {string} collectionName
 * @param {string | number | ObjectId | import("bson").ObjectIdLike | Uint8Array | undefined} docName
 */
async function Read(collectionName, docName, NextIndex = "", limit = 10, where = {}, orderBy = { "Index": "desc" }) {
    return new Promise(async (resolve, reject) => {
        let query, NextField = "Index";
        try {
            if (docName === undefined || docName === "") {
                if (Array.isArray(orderBy)) {
                    if (limit === -1) {
                        // @ts-ignore
                        query = db.collection(collectionName).find(where);
                    }
                    else {
                        // @ts-ignore
                        query = db.collection(collectionName).find(where).limit(limit);
                    }
                }
                else {
                    const OrderByKeys = Object.keys(orderBy);
                    NextField = OrderByKeys[0] || "Index";
                    for (let index = 0; index < OrderByKeys.length; index++) {
                        const element = OrderByKeys[index];
                        if (!where[element]) {
                            where[element] = { "$exists": true };
                        }
                    }
                    orderBy["_id"] = "desc";
                    if (!Check(NextIndex)) {
                        const [Index, nextId] = NextIndex.split('--');
                        if (where["$or"]) {
                            const FirstOr = where["$or"];
                            if (orderBy[NextField] === "desc") {
                                where["$and"] = [
                                    { "$or": FirstOr },
                                    { "$or": [{ [NextField]: { "$lt": Index } }, { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }] },
                                ]
                            }
                            else {
                                where["$and"] = [
                                    { "$or": FirstOr },
                                    { "$or": [{ [NextField]: { "$gt": Index } }, { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }] },
                                ]
                            }

                            delete where["$or"];
                        }
                        else {
                            if (orderBy[NextField] === "desc") {
                                where["$or"] = [{ [NextField]: { "$lt": Index } }, { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }];
                            }
                            else {
                                where["$or"] = [{ [NextField]: { "$gt": Index } }, { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }];
                            }
                        }
                    }


                    if (limit === -1) {
                        // @ts-ignore
                        query = db.collection(collectionName).find(where).sort(orderBy);
                    }
                    else {
                        // @ts-ignore
                        query = db.collection(collectionName).find(where).sort(orderBy).limit(limit);
                    }
                }
                const temp = [];
                const data = await query.toArray();
                data.forEach((doc, index) => {
                    temp.push({ ...doc, "DocId": doc._id.toString(), "NextId": `${doc[NextField]}--${doc._id}` });
                });
                resolve(temp);
            }
            else {
                const data = await db.collection(collectionName).find({ "_id": new ObjectId(docName) }).toArray();
                if (data.length === 1) {
                    resolve({ ...data[0], "DocId": data[0]._id.toString() });
                }
                else {
                    resolve(null);
                }
            }
        }
        catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}

/**
 * 
 * @param {string} collectionName 
 * @param {Array<Object>} AggregateArray 
 * @returns 
 */
async function Aggregate(collectionName, AggregateArray) {
    const data = [];
    const promise = await db.collection(collectionName).aggregate(AggregateArray).toArray();
    promise.forEach((doc) => {
        data.push({ ...doc, "DocId": doc._id.toString(), "NextId": `${doc.Index}--${doc._id}` });
    });

    return data;
}



const Check = (/** @type {string | null | undefined} */ Field) => {
    if (Field === null || Field === undefined || Field === "") {
        return true;
    }
    else {
        return false;
    }
}
// const increment = admin.firestore.FieldValue.increment
// const arrayUnion = admin.firestore.FieldValue.arrayUnion;


/**
 * @param {number} b
 * @param {number} c
 */
function substract(b, c) {
    let tens = [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000]

    let b1 = b.toString().split(".")
    let b1_max = 0
    if (b1.length == 2) {
        b1_max = b1[1].length
    }

    let c1 = c.toString().split(".")
    let c1_max = 0
    if (c1.length == 2) {
        c1_max = c1[1].length
    }

    let max_len = 0
    let max_val = 0
    if (b1_max > c1_max) {
        max_val = tens[b1_max - 1]
        max_len = b1_max
    } else {
        max_len = c1_max
        max_val = tens[c1_max - 1]
    }

    let fv = 0
    if (max_len == 0) {
        //console.log("non decimals")
        max_val = 1
        fv = b - c
    } else {

        fv = parseFloat((((b * max_val) - (c * max_val)) / max_val).toFixed(max_len))

    }
    return fv
}


// async function toBase64(ImgUrl) {
//     const imageToBase64 = require('image-to-base64');

//     return imageToBase64(ImgUrl) // Path to the image
//         .then((response) => {
//             return response; // "cGF0aC90by9maWxlLmpwZw=="
//         })
//         .catch((error) => {
//             return error; // Logs an error if there was one
//         })
// }

const ParamsToFirestoreFields = (QueryParams = {}, FieldTypes = { "index": "number" }) => {
    console.log(QueryParams);

    let Limit, OrderBy = {}, Index, Keyword, Where = {};

    if (!Check(QueryParams["limit"])) {
        if (QueryParams["limit"] === "FALSE") {
            Limit = false;
        }
        else {
            Limit = Number(QueryParams["limit"]);
        }
    }
    else {
        Limit = 10;
    }
    if (!Check(QueryParams["sort_by"])) {
        OrderBy[QueryParams["sort_by"]] = 1;
        if (!Check(QueryParams["order_by"]) && QueryParams["order_by"] === "desc") {
            OrderBy[QueryParams["sort_by"]] = -1;
        }
    }
    if (!Check(QueryParams["after_id"])) {
        Index = QueryParams["after_id"];
    }
    if (!Check(QueryParams["keyword"])) {
        Keyword = QueryParams["keyword"];
    }

    const FixedKeys = ["limit", "sort_by", "after_id", "order_by", "keyword"];
    const keys = Object.keys(QueryParams);
    const types = ["$eq", "$lte", "$gte", "$gt", "$lt", ">>"];

    for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        const Flag = !(FixedKeys.includes(element));

        if (!Flag) {
            continue;
        }
        if (Check(QueryParams[element])) {
            continue;
        }
        if (typeof QueryParams[element] !== 'object') {
            Where[element] = TypeSetting(element, QueryParams[element], FieldTypes);
            continue;
        }
        const type = Object.keys(QueryParams[element]);
        for (let i = 0; i < type.length; i++) {
            const elem = type[i];
            QueryParams[element][elem] = TypeSetting(element, QueryParams[element][elem], FieldTypes);
            if (types.includes(elem)) {
                if (elem === ">>") {
                    Where[element] = QueryParams[element][elem];
                }
                else {
                    Where[element][elem] = QueryParams[element][elem];
                }
            }
        }
    }

    const orderBy = OrderBy;

    return {
        Limit,
        orderBy,
        Index,
        Where,
        Keyword
    }
}

const TypeSetting = (/** @type {string} */ FieldName, /** @type {string} */ FieldData, /** @type {{ [x: string]: any; index?: string; }} */ FieldTypeObj) => {
    if (Check(FieldTypeObj[FieldName])) {
        return FieldData;
    }
    switch (FieldTypeObj[FieldName]) {
        case "string":
            return String(FieldData);
        case "number":
            return Number(FieldData);
        case "array":
            return FieldData.split(",");
        default:
            return String(FieldData)
    }
}


const CheckEntityExists = (/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { message: string; success: boolean; }): void; new (): any; }; }; }} */ res, /** @type {any} */ Entity, /** @type {any} */ EntityString) => {
    if (Check(Entity)) {
        res.status(403).json({
            message: `${EntityString} doesn't exists`,
            success: false,
        });
        return true;
    }
    else {
        return false;
    }
}

async function ReadCount(collectionName, where = {}) {

    return new Promise(async function (resolve, reject) {
        try {
            const data = await db.collection(collectionName).countDocuments(where);
            resolve(data);
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
    });
}


export default {
    Create,
    Update,
    UpdateMany,
    Delete,
    Read,
    ReadCount,
    Aggregate,
    Check,
    CheckEntityExists,
    ObjectId,
    db,

    substract,
    ParamsToFirestoreFields,
};
// 345577194