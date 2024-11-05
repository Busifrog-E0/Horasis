import e from 'express';

import { ReadOneFromTags, ReadTags, UpdateTags, CreateTags, RemoveTags, } from './../databaseControllers/tags-databaseController.js';
import { PullFromManyUsers } from '../databaseControllers/users-databaseController.js';
import { PullFromManyDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { PullFromManyEvents } from '../databaseControllers/events-databaseController.js';
import { PullFromManyPodcasts } from '../databaseControllers/podcasts-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/tags-databaseController.js').TagData} TagData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<TagData>>}
 */
const GetOneFromTags = async (req, res) => {
    const { TagId } = req.params;
    const data = await ReadOneFromTags(TagId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<TagData>>>}
 */
const GetTags = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadTags(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostTags = async (req, res) => {
    await CreateTags(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchTags = async (req, res) => {
    const { TagId } = req.params;
    await UpdateTags(req.body, TagId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteTags = async (req, res) => {
    const { TagId } = req.params;
    const Tag = await ReadOneFromTags(TagId);
    await RemoveTags(TagId);
    await Promise.all([
        PullFromManyUsers({ Interests: { DocId: TagId, TagName: Tag.TagName } }, { "Interests.DocId": TagId }),
        PullFromManyDiscussions({ Tags: { DocId: TagId, TagName: Tag.TagName } }, { "Tags.DocId": TagId }),
        PullFromManyEvents({ Tags: { DocId: TagId, TagName: Tag.TagName } }, { "Tags.DocId": TagId }),
        PullFromManyPodcasts({ Tags: { DocId: TagId, TagName: Tag.TagName } }, { "Tags.DocId": TagId })
    ])
    return res.json(true);
}


export {
    GetOneFromTags, GetTags, PostTags, PatchTags, DeleteTags
}