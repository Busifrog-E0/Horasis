import e from 'express';

import { ReadOneFromArticles, ReadArticles, UpdateArticles, CreateArticles, RemoveArticles, } from './../databaseControllers/articles-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
import { DetectLanguage } from './translations-controller.js';
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
    //@ts-ignore
    const { UserId } = req.user;
    const Article = await ReadOneFromArticles(ArticleId);
    const data = await SetArticleDataForGet(Article, UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ArticleData>>>}
 */
const GetArticles = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    //@ts-ignore
    const { UserId } = req.user;
    if (Keyword) {
        //@ts-ignore
        Filter["ArticleName"] = { $regex: Keyword, $options: 'i' };

    }
    // @ts-ignore
    const Articles = await ReadArticles(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Articles.map(async Article => await SetArticleDataForGet(Article, UserId)))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostArticles = async (req, res) => {
    req.body = ArticleInit(req.body);
    req.body.OriginalLanguage = await DetectLanguage(req.body.Description);
    const ArticleId = await CreateArticles(req.body);
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
    if (req.body.Description) {
        req.body.OriginalLanguage = await DetectLanguage(req.body.Description);
        req.body.Languages = {}
    }
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

/**
 * 
 * @param {ArticleData} Article 
 * @param {string} UserId
 */
const SetArticleDataForGet = async (Article, UserId) => {
    const [UserDetails, checkLike, checkSave] = await Promise.all([
        ReadOneFromUsers(Article.AuthorId),
        ReadLikes({ EntityId: Article.DocId, UserId }, undefined, 1, undefined),
        ReadSaves({ EntityId: Article.DocId, UserId }, undefined, 1, undefined)
    ])
    const HasSaved = checkSave.length > 0;
    const HasLiked = checkLike.length > 0;
    return { ...Article, HasLiked, HasSaved, UserDetails }
}

const ArticleInit = (Article) => {
    return {
        ...Article,
        NoOfLikes: 0,
        NoOfComments: 0
    }
}


export {
    GetOneFromArticles, GetArticles, PostArticles, PatchArticles, DeleteArticles,
    SetArticleDataForGet
}