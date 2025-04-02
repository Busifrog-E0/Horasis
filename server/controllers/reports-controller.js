import e from 'express';

import { ReadOneFromReports, ReadReports, UpdateReports, CreateReports, RemoveReports, UpdateManyReports, } from './../databaseControllers/reports-databaseController.js';
import { ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromComments } from '../databaseControllers/comments-databaseController.js';
import { ReadOneFromArticles } from '../databaseControllers/articles-databaseController.js';
import { ReadOneFromPodcasts } from '../databaseControllers/podcasts-databaseController.js';
import { AlertBoxObject, DeleteFnBasedOnType } from './common.js';
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
    req.body = ReportInit(req.body);
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
    const Report = await ReadOneFromReports(ReportId);
    if (Report.IsDeleted) {
        return res.status(444).json(AlertBoxObject('Already Deleted', 'This Report is already deleted'));
    }
    const { EntityId, Type } = Report;
    await Promise.all([
        UpdateManyReports({ IsDeleted: true }, { EntityId }),
        DeleteFnBasedOnType[Type](EntityId)
    ])
    return res.json(true);
}


const ReportInit = (Data) => {
    return {
        ...Data,
        IsDeleted: false,
        IsViewed: false,
    }
}

export {
    GetOneFromReports, GetReports, PostReports, PatchReports, DeleteReports
}