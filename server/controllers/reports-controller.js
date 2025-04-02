import e from 'express';

import { ReadOneFromReports, ReadReports, UpdateReports, CreateReports, RemoveReports, } from './../databaseControllers/reports-databaseController.js';
import { ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromComments } from '../databaseControllers/comments-databaseController.js';
import { ReadOneFromArticles } from '../databaseControllers/articles-databaseController.js';
import { ReadOneFromPodcasts } from '../databaseControllers/podcasts-databaseController.js';
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
    const { Type } = Filter;
    const ReadFnObj = {
        "Event": ReadOneFromEvents, "Discussions": ReadOneFromDiscussions, "Activity": ReadOneFromActivities,
        "Comment": ReadOneFromComments, "Article": ReadOneFromArticles, "Podcast": ReadOneFromPodcasts
    };
    const ReadFn = ReadFnObj[Type];
    // @ts-ignore
    const Reports = await ReadReports(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Reports.map(async Report => await ReadFn(Report.EntityId)));
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