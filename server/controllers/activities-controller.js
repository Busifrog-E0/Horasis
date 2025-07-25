import e from 'express';

import { ReadOneFromActivities, ReadActivities, UpdateActivities, CreateActivities, RemoveActivities, AggregateActivities, } from '../databaseControllers/activities-databaseController.js';
import { fileTypeFromBuffer } from 'file-type';
import { AsyncSaveFileToSpaces, fileFormats, } from './files-controller.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ObjectId } from 'mongodb';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';
import { ReadSaves } from '../databaseControllers/saves-databaseController.js';
import { PostMediasFromAttachments } from './medias-controller.js';
import { RemoveNotificationForEntity, RemoveNotificationsAfterActivityMentionPatch, SendNotificationstoActivityMentions } from './notifications-controller.js';
import { DetectLanguage } from './translations-controller.js';
import { IncrementDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { IncrementEvents } from '../databaseControllers/events-databaseController.js';
import { ReadUserExtendedProperties } from '../databaseControllers/userExtendedProperties-databaseController.js';
import { ActivityExtendedPropertiesInit, CreateActivityExtendedProperties, PushOnceInManyActivityExtendedProperties, ReadActivityExtendedProperties } from '../databaseControllers/activityExtendedProperties-databaseController.js';
import moment from 'moment';
import { IncrementPodcasts } from '../databaseControllers/podcasts-databaseController.js';

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
    //@ts-ignore
    const { UserId } = req.user;
    const Activity = await ReadOneFromActivities(ActivityId);
    const data = await SetActivityDataForGet(Activity, UserId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<ActivityData>>>}
 */
const GetActivities = async (req, res) => {
    //@ts-ignore
    const { UserId } = req.user;
    const { NextId, Limit, Filter, OrderBy, Keyword } = req.query;
    //@ts-ignore
    const UserConnectedActivities = await ReadActivityExtendedProperties({ Type: "ConnectionsList", "Content.ConnectionsList": UserId }, NextId, Limit, OrderBy);
    const Activities = await Promise.all(UserConnectedActivities.map(async Activity => {
        const ActivityData = await ReadOneFromActivities(Activity.ActivityId);
        //@ts-ignore
        return { ...ActivityData, NextId: Activity.NextId }
    }));
    const data = await Promise.all(Activities.map(async Activity => await SetActivityDataForGet(Activity, UserId)))
    return res.json(data);
};


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetFilteredActivities = async (req, res) => {
    const UserId = req.params.UserId ?? req.user.UserId;
    const { Filter, NextId, Limit, OrderBy, Keyword } = req.query;
    if (Keyword) {
        //@ts-ignore
        Filter["Content"] = { $regex: Keyword, $options: 'i' };
    }
    //@ts-ignore
    const Activities = await ReadActivities(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Activities.map(async Activity => await SetActivityDataForGet(Activity, UserId)))
    return res.json(data)
}



/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostActivities = async (req, res) => {
    const { Content } = req.body;
    let { MediaFiles, Documents } = req.body;
    const ActivityId = (new ObjectId()).toString();
    //@ts-ignore
    const { UserId } = req.user;
    const ValidateFiles = await CheckFileType(MediaFiles, Documents);
    if (!ValidateFiles) {
        return res.status(444).json(AlertBoxObject("Can't upload", "File(s) cannot be uploaded"))
    }
    const Attachments = await UploadFiles(MediaFiles, Documents, UserId, ActivityId);
    const Mentions = await ExtractMentionedUsersFromContent(Content);
    req.body = ActivityInit(req.body);
    //@ts-ignore
    const data = {
        ...req.body, Documents: Attachments.DocumentsLinks,
        MediaFiles: Attachments.MediaFilesLinks, Mentions,
        OriginalLanguage: await DetectLanguage(Content)
    };

    await Promise.all([
        CreateActivities(data, ActivityId),
        PostMediasFromAttachments(Attachments, ActivityId, UserId),
        SendNotificationstoActivityMentions(Mentions, UserId, ActivityId),
        req.body.Type === "Feed" ? AddtoUserActivities({ ...data, ActivityId }) : null,
        req.body.Type === "Discussion" ? IncrementDiscussions({ NoOfActivities: 1 }) :
            req.body.Type === "Event" ? IncrementEvents({ NoOfActivities: 1 }) : IncrementPodcasts({ NoOfActivities: 1 })
    ])
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
    //@ts-ignore
    const { UserId } = req.user;
    const Activity = await ReadOneFromActivities(ActivityId);
    if (Activity.UserId !== UserId) {
        return res.status(444).json(AlertBoxObject("Cannot Edit", "Cannot edit other User's Activity"))
    }
    if (req.body.Content) {
        req.body.Mentions = await ExtractMentionedUsersFromContent(req.body.Content);
        req.body.OriginalLanguage = await DetectLanguage(req.body.Content)
        req.body.Languages = {};
    }
    await Promise.all([
        UpdateActivities(req.body, ActivityId),
        RemoveNotificationsAfterActivityMentionPatch(req.body.Mentions, Activity.Mentions, UserId, ActivityId),
    ])

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
    //@ts-ignore
    const { UserId } = req.user;
    const Activity = await ReadOneFromActivities(ActivityId);
    if (Activity.UserId !== UserId && req.user.Role === "User") {
        return res.status(444).json(AlertBoxObject("Cannot Delete", "Cannot delete other User's Activity"))
    }
    await RemoveActivities(ActivityId);
    await RemoveNotificationForEntity(ActivityId);
    Activity.Type === "Discussion" ? await IncrementDiscussions({ NoOfActivities: -1 }) :
        Activity.Type === "Event" ? await IncrementEvents({ NoOfActivities: -1 }) : await IncrementPodcasts({ NoOfActivities: -1 });
    return res.json(true);
}

/**
 * 
 * @param {{FileData : Array,FileName : string}[]} MediaFiles 
 * @param {{FileData : Array,FileName : string}[]} Documents 
 * @returns {Promise<boolean>}
 */
const CheckFileType = async (MediaFiles, Documents) => {
    const mediaValidate = async (FileData) => {
        if (!(await FileValidate(FileData, fileFormats.image) || await FileValidate(FileData, fileFormats.video))) {
            throw new Error("File Format or Size not supported")
        }
        return;
    }
    const documentValidate = async (FileData) => {
        if (!(await FileValidate(FileData, fileFormats.document))) {
            throw new Error("File Format or Size not supported")
        }
        return;
    }
    try {
        await Promise.all([
            ...MediaFiles.map(async File => mediaValidate(File.FileData)),
            ...Documents.map(async File => documentValidate(File.FileData))
        ])
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

/**
 * 
 * @param {Array} FileData 
 * @param {{extensions : string[],size : number}} Format 
 * @returns 
 */
const FileValidate = async (FileData, Format) => {
    const FileDataBuffer = new Uint8Array(FileData);
    //@ts-ignore
    const { ext } = await fileTypeFromBuffer(FileDataBuffer);
    const Size = FileData.length;
    return Format.extensions.includes(ext) && Size <= Format.size;
}

/**
 * 
 * @param {{FileData : Array,FileName : string}[]} MediaFiles 
 * @param {{FileData : Array,FileName : string}[]} Documents  
 * @param {string} UserId 
 * @param {string} ActivityId 
 * @returns 
 */
const UploadFiles = async (MediaFiles, Documents, UserId, ActivityId) => {
    const MediaFilesLinks = await Promise.all(MediaFiles.map(async File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const { mime } = await fileTypeFromBuffer(FileBuffer);
        const [Type] = mime.split('/');
        const Link = await AsyncSaveFileToSpaces(UserId, `${ActivityId}/${FileName}`, FileData, mime)
        return { FileUrl: Link, Type }
    }));
    const DocumentsLinks = await Promise.all(Documents.map(async File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const { mime } = await fileTypeFromBuffer(FileBuffer);
        return AsyncSaveFileToSpaces(UserId, `${ActivityId}/${FileName}`, FileData, mime)
    }));
    return { MediaFilesLinks, DocumentsLinks };
}



/**
 * 
 * @param {object} Data 
 * @param {string} UserId 
 * @returns 
 */
const PostActivityForProfilePatch = async (Data, UserId) => {
    if (!Data.ProfilePicture && !Data.CoverPicture) {
        return;
    }
    let Activity = Data.CoverPicture ? { Content: "Updated their Cover Photo", MediaFiles: [{ FileUrl: Data.CoverPicture, Type: "image" }], UserId } :
        { Content: "Updated their Profile Photo", MediaFiles: [{ FileUrl: Data.ProfilePicture, Type: "image" }], UserId, Type: "Feed" , EntityId : "Feed" };
    Activity = ActivityInit(Activity);
    await CreateActivities(Activity);
}

const ActivityInit = (Activity) => {
    return {
        NoOfLikes: 0,
        ...Activity,
        NoOfComments: 0,
        Index: String(Date.now()),
        CreatedIndex: Date.now()
    }
}
/**
 * 
 * @param {string} Content 
 * @returns {Promise<{Username : string,UserId : string,FullName : string}[]>}
 */
const ExtractMentionedUsersFromContent = async (Content) => {
    const mentionPattern = /(?<=\s|^)@([\w.]+)/g;
    const mentions = Content.match(mentionPattern);
    let Users = [];
    if (mentions) {
        await Promise.all(mentions.map(async mention => {
            const Username = mention.slice(1);
            const User = await ReadUsers({ Username }, undefined, 1, undefined);
            if (User.length > 0) {
                Users.push({ Username, UserId: User[0].DocId, FullName: User[0].FullName })
            }
        }))
    }
    return Users;
};

/**
 * 
 * @param {ActivityData} Activity
 */
const AddtoUserActivities = async (Activity) => {
    const UserConnectionsList = await ReadUserExtendedProperties({ Type: "ConnectionsList", UserId: Activity.UserId }, undefined, -1, undefined);
    await Promise.all(UserConnectionsList.map(async UserConnection => {
        await CreateActivityExtendedProperties(ActivityExtendedPropertiesInit({
            //@ts-ignore
            ActivityId: Activity.ActivityId,
            Type: "ConnectionsList",
            Content: { ConnectionsList: UserConnection.Content.ConnectionsList, ConnectionListId: UserConnection.DocId },
            UserId: Activity.UserId,
            //@ts-ignore
            Index: Activity.Index,
            //@ts-ignore
            CreatedIndex: Activity.CreatedIndex
        }))
    }))
}

const PushConnectionToUserActivities = async (ConnectionId, ConnectionListId, UserId) => {
    const [ConnectionListData] = await ReadActivityExtendedProperties({ "Content.ConnectionListId": ConnectionListId }, undefined, 1, undefined);
    if (ConnectionListData) {
        await PushOnceInManyActivityExtendedProperties({ "Content.ConnectionsList": ConnectionId }, { "Content.ConnectionListId": ConnectionListId })
        return;
    }
    const Activities = await ReadActivities({ UserId }, undefined, -1, undefined);
    await Promise.all(Activities.map(async Activity => {
        await CreateActivityExtendedProperties(ActivityExtendedPropertiesInit({
            //@ts-ignore
            ActivityId: Activity.DocId,
            Type: "ConnectionsList",
            Content: { ConnectionsList: [ConnectionId], ConnectionListId },
            UserId: Activity.UserId,
            //@ts-ignore
            Index: Activity.Index,
            //@ts-ignore
            CreatedIndex: Activity.CreatedIndex
        }))
    }))
    return;
}

/**
 * 
 * @param {ActivityData} Activity 
 * @param {string} UserId 
 * @returns 
 */
const SetActivityDataForGet = async (Activity, UserId) => {
    const [UserDetails, checkLike, checkSave] = await Promise.all([
        ReadOneFromUsers(Activity.UserId),
        ReadLikes({ EntityId: Activity.DocId, UserId }, undefined, 1, undefined),
        ReadSaves({ EntityId: Activity.DocId, UserId }, undefined, 1, undefined)
    ])
    const HasSaved = checkSave.length > 0;
    const HasLiked = checkLike.length > 0;
    return { ...Activity, UserDetails, HasLiked, HasSaved }
}




export {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    PostActivityForProfilePatch, GetFilteredActivities, ExtractMentionedUsersFromContent,
    SetActivityDataForGet, AddtoUserActivities, PushConnectionToUserActivities
}