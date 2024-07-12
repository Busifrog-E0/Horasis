import e from 'express';

import { ReadOneFromComments, ReadComments, UpdateComments, CreateComments, RemoveComments, CommentCount, } from './../databaseControllers/comments-databaseController.js';
/**
 * @typedef {import('./../databaseControllers/comments-databaseController.js').CommentData} CommentData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<CommentData>>}
 */
const GetOneFromComments = async (req, res) => {
    const { CommentId } = req.params;
    const data = await ReadOneFromComments(CommentId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<CommentData>>>}
 */
const GetComments = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadComments(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostComments = async (req, res) => {
    await CreateComments(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchComments = async (req, res) => {
    const { CommentId } = req.params;
    await UpdateComments(req.body, CommentId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteComments = async (req, res) => {
    const { CommentId } = req.params;
    await RemoveComments(CommentId);
    return res.json(true);
}

const GetActivityCommentCount = async (ActivityId) => {
    let NoOfComments = 0;
    const CommentsData = await ReadComments({ ParentId: ActivityId }, undefined, -1, undefined);
    CommentsData.forEach(async Comment => {
        const ReplyCount = await CommentCount({ ParentId: Comment.DocId });
        NoOfComments += ReplyCount + 1;
    })
    return NoOfComments;
}
export {
    GetOneFromComments, GetComments, PostComments, PatchComments, DeleteComments,
    GetActivityCommentCount
}