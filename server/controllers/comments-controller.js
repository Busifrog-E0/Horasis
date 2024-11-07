import e from 'express';

import { ReadOneFromComments, ReadComments, UpdateComments, CreateComments, RemoveComments, IncrementComments, } from './../databaseControllers/comments-databaseController.js';
import { IncrementActivities } from '../databaseControllers/activities-databaseController.js';
import { ReadOneFromUsers } from '../databaseControllers/users-databaseController.js';
import { ExtractMentionedUsersFromContent } from './activities-controller.js';
import { SendNotificationstoCommentMentions, SendNotificationToUserOnCommentPost } from './notifications-controller.js';
import { IncrementArticles } from '../databaseControllers/articles-databaseController.js';
import { DetectLanguage } from './translations-controller.js';
import { GetParentTypeFromEntity } from './common.js';
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
    const { ActivityId } = req.params;
    req.body.Type = "Comment";
    const Mentions = await ExtractMentionedUsersFromContent(req.body.Content);
    req.body.OriginalLanguage = await DetectLanguage(req.body.Content);
    req.body.UserDetails = await ReadOneFromUsers(req.body.UserId)
    if (req.body.ParentType === "Activity") {
        await IncrementActivities({ NoOfComments: 1 }, ActivityId,);
        await SendNotificationToUserOnCommentPost(ActivityId, req.body.UserId);
        await SendNotificationstoCommentMentions(Mentions, req.body.UserId, ActivityId);
    }
    if (req.body.ParentType === "Article") {
        await IncrementArticles({ NoOfComments: 1 }, ActivityId);
    }
    if (req.params.CommentId) {
        await IncrementComments({ NoOfReplies: 1 }, req.params.CommentId);
        req.body.Type = "Reply";
    }
    const { ParentId: RootParentId, ParentType: RootParentType } = req.body.Type === "Reply" ?
        await GetParentTypeFromEntity(req.params.CommentId, "Comment") : await GetParentTypeFromEntity(req.body.ParentId, req.body.ParentType);;
    req.body = CommentInit(req.body);
    await CreateComments({ ...req.body, Mentions, RootParentId, RootParentType });
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
    req.body.OriginalLanguage = await DetectLanguage(req.body.Content);
    req.body.Languages = {};
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
    if (Comment.Type === "Reply") {
        await IncrementComments({ NoOfReplies: -1 }, Comment.ParentId);
    }
    await RemoveComments(CommentId);
    await IncrementActivities({ NoOfComments: -1 }, ActivityId);
    return res.json(true);
}

const CommentInit = (CommentData) => {
    return {
        NoOfReplies: 0,
        NoOfLikes: 0,
        ...CommentData
    }
}
export {
    GetOneFromComments, GetComments, PostComments, PatchComments, DeleteComments,

}