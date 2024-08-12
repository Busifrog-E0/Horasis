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
            if (!data.Index && index) {
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
 * @returns {Promise<true>}
 */
async function UpdateMany(collectionName, data, filter, operation = ["$set"], ...dataSets) {
        try {
            const OperationObject = { [operation[0]]: data }
            for (let index = 1; index < operation.length; index++) {
                OperationObject[operation[index]] = dataSets[index - 1];
            }
            await db.collection(collectionName).updateMany(filter, OperationObject);
            return true;
        } catch (error) {
            logger.log(error);
            throw new Error(error);
        }
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
 * @return {Promise<object|Array<object>|null>}
 */
async function Read(collectionName, docName, NextIndex = "", limit = 10, where = {}, orderBy = { "Index": "desc" }) {
        let query, NextField = "Index";
        try {
            if (docName === undefined || docName === "") {

                    const OrderByKeys = Object.keys(orderBy);
                    NextField = OrderByKeys[0] || "Index";
                    for (let index = 0; index < OrderByKeys.length; index++) {
                        if (!where[OrderByKeys[index]]) {
                            where[OrderByKeys[index]] = { "$exists": true };
                        }
                    }
                    orderBy["_id"] = "desc";
                if (NextIndex) {
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

                const temp = [];
                const data = await query.toArray();
                data.forEach((doc, index) => {
                    const NextFieldData = NextField.split(".").reduce((prev, cur) => {
                        return prev[cur];
                    }, doc);
                    temp.push({ ...doc, "DocId": doc._id.toString(), "NextId": `${NextFieldData}--${doc._id}` });
                });
                return temp;
            }
            else {
                const data = await db.collection(collectionName).find({ "_id": new ObjectId(docName) }).toArray();
                if (data.length === 1) {
                    return { ...data[0], "DocId": data[0]._id.toString() };
                }
                else {
                    return null;
                }
            }
        }
        catch (error) {
            logger.log(error);
            throw new Error(error);
        }
}

/**
 * 
 * @param {string} collectionName 
 * @param {Array<Object>} AggregateArray 
 * @param {string} NextIndex
 * @param {number} limit
 * @param {object} orderBy
 * @returns 
 */
async function Aggregate(collectionName, AggregateArray, NextIndex = "", limit = 10, orderBy = { "Index": "desc" }) {
    const data = [];
    if (!Check(NextIndex)) {
        let sortMatchObject = {};
        const OrderByKeys = Object.keys(orderBy);
        let NextField = OrderByKeys[0] || "Index";
        const [Index, nextId] = NextIndex.split('--');
        if (orderBy[NextField] === "desc") {
            sortMatchObject["$or"] = [
                { [NextField]: { "$lt": Index } },
                { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }]
        }
        else {
            sortMatchObject["$or"] = [
                { [NextField]: { "$gt": Index } },
                { [NextField]: Index, "_id": { "$lt": new ObjectId(nextId) } }]
        }
        AggregateArray.push({ $match: sortMatchObject });
    }
    orderBy = ConvertSortForAggregate(orderBy);
    AggregateArray.push({ $sort: orderBy });
    if (limit !== -1) {
        AggregateArray.push({ $limit: limit });
    }
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

const ConvertSortForAggregate = (orderBy) => {
    return Object.keys(orderBy).reduce((acc, field) => {
        acc[field] = orderBy[field] === 'asc' ? 1 : -1;
        return acc;
    }, {});
}

const TypeSetting = (/** @type {string} */ FieldName, /** @type {string} */ FieldData, /** @type {{ [x: string]: any; index?: string; }} */ FieldTypeObj) => {
    if (!FieldTypeObj[FieldName]) {
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
    ObjectId,
    db,

    substract,
};