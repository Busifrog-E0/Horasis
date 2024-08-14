import e from 'express';

import { ReadOneFromArticles, ReadArticles, UpdateArticles, CreateArticles, RemoveArticles, } from './../databaseControllers/articles-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/articles-databaseController.js').ArticleData} ArticleData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<ArticleData>>}
 */
const GetOneFromArticles = async (req, res) => {
    const { ArticleId } = req.params;
    const data = await ReadOneFromArticles(ArticleId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ArticleData>>>}
 */
const GetArticles = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadArticles(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostArticles = async (req, res) => {
    const { AuthorId } = req.body;
    const UserDetails = await ReadOneFromUsers(AuthorId);
    const ArticleId = await CreateArticles({ ...req.body, UserDetails });
    return res.json(ArticleId);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchArticles = async (req, res) => {
    const { ArticleId } = req.params;
    await UpdateArticles(req.body, ArticleId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteArticles = async (req, res) => {
    const { ArticleId } = req.params;
    await RemoveArticles(ArticleId);
    return res.json(true);
}


export {
    GetOneFromArticles, GetArticles, PostArticles, PatchArticles, DeleteArticles
}