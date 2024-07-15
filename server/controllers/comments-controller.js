import e from 'express';

import { ReadOneFromComments, ReadComments, UpdateComments, CreateComments, RemoveComments, CommentCount, IncrementComments, } from './../databaseControllers/comments-databaseController.js';
import { IncrementActivities, UpdateActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
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
    const { ParentId } = req.params;
    // @ts-ignore
    Filter.ParentId = ParentId;
    // @ts-ignore
    const Comments = await ReadComments(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Comments.map(async Comment => {
        const User = await ReadOneFromUsers(Comment.UserId);
        return { ...Comment, User }
    }))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostComments = async (req, res) => {
    const { ActivityId } = req.params;
    req.body.Type = "Comment";
    await IncrementActivities({ NoOfComments: 1 }, ActivityId, );
    if (req.params.CommentId) {
        await IncrementComments({ NoOfReplies: 1 }, req.params.CommentId);
        req.body.Type = "Reply";
    }
    req.body = CommentInit(req.body);
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
    const { CommentId, ActivityId } = req.params;
    const Comment = await ReadOneFromComments(CommentId);
    if (Comment.Type == "Reply") {
        await IncrementComments({ NoOfReplies: -1 }, Comment.ParentId);
    }
    await RemoveComments(CommentId);
    await IncrementActivities({ NoOfComments: -1 }, ActivityId);
    return res.json(true);
}

const CommentInit = (CommentData) => {
    return {
        NoOfReplies: 0,
        ...CommentData
    }
}
export {
    GetOneFromComments, GetComments, PostComments, PatchComments, DeleteComments,

}