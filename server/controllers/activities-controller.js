import e from 'express';

import { ReadOneFromActivities, ReadActivities, UpdateActivities, CreateActivities, RemoveActivities, UpdateAndIncrementActivities, } from '../databaseControllers/activities-databaseController.js';
import { fileTypeFromBuffer } from 'file-type';
import { AsyncSaveFileToSpaces, documentExtensions, mediaExtensions } from './files-controller.js';
import { ReadUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';

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
    const data = await ReadOneFromActivities(ActivityId);
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
    const data = await ReadActivities(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostActivities = async (req, res) => {
    const { Attachments, Content } = req.body;
    //@ts-ignore
    const { UserId } = req.user;
    let promises = [];
    promises.push(SeperateAttachments(Attachments, UserId));
    promises.push(ExtractMentionedUsersFromContent(Content));

    const [AttachmentsLinksObject, Mentions] = await Promise.all(promises);

    if (!AttachmentsLinksObject) {
        return res.status(444).json(AlertBoxObject("Cannot Upload File", " The file(s) cannot be uploaded"));
    }

    req.body = ActivityInit(req.body);
    //@ts-ignore
    const { Documents, MediaFiles, AttachmentLinks } = AttachmentsLinksObject;
    req.body.Attachments = AttachmentLinks;
    const data = { ...req.body, Documents, MediaFiles, Mentions };
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
    req.body.Mentions = await ExtractMentionedUsersFromContent(req.body.Content);
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
    Attachments.forEach(async File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const { ext, mime } = fileTypeFromBuffer(FileBuffer);
        if (documentExtensions.includes(ext)) {
            const FileURI = await AsyncSaveFileToSpaces(UserId, `doc_${FileName}`, FileData, mime)
            Documents.push(FileURI);
        }
        else if (mediaExtensions.includes(ext)) {
            const FileURI = await AsyncSaveFileToSpaces(UserId, `media_${FileName}`, FileData, mime)
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
        ...Activity,
        NoOfComments: 0,
        LikedIds : []
    }
}
/**
 * 
 * @param {string} Content 
 * @returns 
 */
const ExtractMentionedUsersFromContent =async (Content) => {
    const mentionPattern = /@(\w+)/g;
    const mentions = Content.match(mentionPattern);
    let Users = [];
    if (mentions) {
        mentions.forEach(async mention => {
            const Username = mention.slice(1);
            const User = await ReadUsers({ Username}, undefined, 1, undefined);
            if (User.length > 0) {
                Users.push({ Username, UserId: User[0].DocId })
            }
        })
    }
    return Users;
};


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const LikeAnActivity = async (req, res) => {
    const { UserId, ActivityId } = req.params;
    const {LikedIds,DocId} = await ReadOneFromActivities(ActivityId);
    if (LikedIds.includes(UserId)) {
        return res.status(444).json(AlertBoxObject("Already Liked this post", "You have already liked this post"));
    }
    LikedIds.push(UserId);
    await UpdateAndIncrementActivities({ LikedIds }, { NoOfLikes: 1 }, DocId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const DislikeAnActivity = async (req, res) => {
    const { UserId, ActivityId } = req.params;
    const { LikedIds, DocId } = await ReadOneFromActivities(ActivityId);
    if (!LikedIds.includes(UserId)) {
        return res.status(444).json(AlertBoxObject("Not Liked this post", "You have not liked this post"));
    }
    const NewLikedIds = LikedIds.filter(Id => Id != UserId);
    await UpdateAndIncrementActivities({ LikedIds : NewLikedIds }, { NoOfLikes: -1 }, DocId);
    return res.json(true);
}




export {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    LikeAnActivity,DislikeAnActivity
}