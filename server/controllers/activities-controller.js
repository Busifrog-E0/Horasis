import e from 'express';

import { ReadOneFromActivities, ReadActivities, UpdateActivities, CreateActivities, RemoveActivities, } from '../databaseControllers/activities-databaseController.js';
import { GetFileFromURI } from './common.js';
import { fileTypeFromBuffer } from 'file-type';
import { AsyncSaveFileToSpaces, documentExtensions, mediaExtensions } from './files-controller.js';
import { CommentCount, ReadComments } from '../databaseControllers/comments-databaseController.js';
import { GetActivityCommentCount } from './comments-controller.js';
/**
 * @typedef {import('../databaseControllers/activities-databaseController.js').ActivityData} ActivityData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<ActivityData>>}
 */
const GetOneFromActivities = async (req, res) => {
    const { ActivityId } = req.params;
    const Activity = await ReadOneFromActivities(ActivityId);
    const NoOfComments = await GetActivityCommentCount(ActivityId);
    const data = {...Activity,NoOfComments}
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ActivityData>>>}
 */
const GetActivities = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const Activities = await ReadActivities(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Activities.map(async Activity => {
        const NoOfComments = await GetActivityCommentCount(Activity.DocId);
        return { ...Activity, NoOfComments }
    }))
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostActivities = async (req, res) => {
    const { Attachments } = req.body;
    //@ts-ignore
    const { UserId } = req.user;
    const AttachmentsLinksObject = await SeperateAttachments(Attachments, UserId);
    if (!AttachmentsLinksObject) {
        return res.status(444).json("Cannot Upload this file");
    }
    req.body = ActivityInit(req.body);
    const { Documents, MediaFiles, AttachmentLinks } = AttachmentsLinksObject;
    req.body.Attatchments = AttachmentLinks;
    const data = { ...req.body, Documents, MediaFiles };
    await CreateActivities(data);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchActivities = async (req, res) => {
    const { ActivityId } = req.params;
    await UpdateActivities(req.body, ActivityId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteActivities = async (req, res) => {
    const { ActivityId } = req.params;
    await RemoveActivities(ActivityId);
    return res.json(true);
}

/**
 * 
 * @param {{FileData : Array,FileName : string}[]} Attachments 
 * @param {string} UserId 
 * @returns {Promise<{Documents : Array,MediaFiles : Array,AttachmentLinks : Array}|false>}
 */
const SeperateAttachments = async (Attachments, UserId) => {
    let Documents = [], MediaFiles = [];

    Attachments.forEach(File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const { ext, mime } = fileTypeFromBuffer(FileBuffer);
        if (documentExtensions.includes(ext)) {
            const FileURI = AsyncSaveFileToSpaces(UserId, `doc_${FileName}`, FileData, mime)
            Documents.push(FileURI);
        }
        else if (mediaExtensions.includes(ext)) {
            const FileURI = AsyncSaveFileToSpaces(UserId, `media_${FileName}`, FileData, mime)
            MediaFiles.push(FileURI);
        }
        else {
            return false;
        }
    });
    const AttachmentLinks = [...Documents, ...MediaFiles];
    return { Documents, MediaFiles, AttachmentLinks };
}

const ActivityInit = (Activity) => {
    return {
        NoOfLikes: 0,
        ...Activity
    }
}

export {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities
}