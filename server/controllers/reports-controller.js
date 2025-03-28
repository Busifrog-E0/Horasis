import e from 'express';

import { ReadOneFromReports, ReadReports, UpdateReports, CreateReports, RemoveReports, } from './../databaseControllers/reports-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/reports-databaseController.js').ReportData} ReportData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<ReportData>>}
 */
const GetOneFromReports = async (req, res) => {
    const { ReportId } = req.params;
    const data = await ReadOneFromReports(ReportId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ReportData>>>}
 */
const GetReports = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadReports(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostReports = async (req, res) => {
    await CreateReports(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchReports = async (req, res) => {
    const { ReportId } = req.params;
    await UpdateReports(req.body, ReportId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteReports = async (req, res) => {
    const { ReportId } = req.params;
    await RemoveReports(ReportId);
    return res.json(true);
}


export {
    GetOneFromReports, GetReports, PostReports, PatchReports, DeleteReports
}