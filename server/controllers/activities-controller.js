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
    if (Keyword) {
        //@ts-ignore
        Filter["Content"] = { $regex: Keyword, $options: 'i' };
    }
    //@ts-ignore
    const FilterConditions = Object.entries(Filter).map(([key, value]) => ({ [key]: value }));
    const AggregateArray = [
        {
            $lookup: {
                from: 'Follows',
                pipeline: [
                    { $match: { '$expr': { '$eq': ['$FollowerId', UserId] } } }
                ],
                as: 'Followees'
            }
        },
        {
            $lookup: {
                from: 'Connections',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: [UserId, '$UserIds'] },
                                    { $eq: ['$Status', 'Connected'] }
                                ]
                            }
                        }
                    }
                ],
                as: 'Connections'
            }
        },
        {
            $addFields: {
                Followees: {
                    $map: {
                        input: '$Followees',
                        as: 'f',
                        in: '$$f.FolloweeId'
                    }
                },
                Connections: {
                    $reduce: {
                        input: '$Connections',
                        initialValue: [],
                        in: { $setUnion: ['$$value', '$$this.UserIds'] }
                    }
                }
            }
        },
        {
            $addFields: {
                UserIds: { $setUnion: ['$Followees', '$Connections', [UserId]] }
            }
        },
        {
            $match: {
                $and: [
                    { $expr: { $in: ['$UserId', '$UserIds'] } },
                    ...FilterConditions
                ]
            }
        },
        {
            $project: {
                Followees: 0,
                Connections: 0,
                UserIds: 0
            }
        }
    ]
    const Activities = await AggregateActivities(AggregateArray, NextId, Limit, OrderBy);
    const data = await Promise.all(Activities.map(async Activity => {
        const [UserDetails, checkLike, checkSave] = await Promise.all([
            ReadOneFromUsers(Activity.UserId),
            ReadLikes({ EntityId: Activity.DocId, UserId }, undefined, 1, undefined),
            ReadSaves({ EntityId: Activity.DocId, UserId }, undefined, 1, undefined)
        ])
        const HasSaved = checkSave.length > 0;
        const HasLiked = checkLike.length > 0;
        return { ...Activity, UserDetails, HasLiked, HasSaved }
    }))
    return res.json(data);
};


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetFilteredActivities = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Limit, OrderBy } = req.query;
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
        req.body.Type !== "Feed" ?
            req.body.Type === "Discussion" ?
                IncrementDiscussions({ NoOfActivities: 1 }) : IncrementEvents({ NoOfActivities: 1 }) : null
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
    if (Activity.UserId !== UserId) {
        return res.status(444).json(AlertBoxObject("Cannot Delete", "Cannot delete other User's Activity"))
    }
    await RemoveActivities(ActivityId);
    await RemoveNotificationForEntity(ActivityId);
    return res.json(true);
}

/**
 * 
 * @param {{FileData : Array,FileName : string}[]} MediaFiles 
 * @param {{FileData : Array,FileName : string}[]} Documents 
 * @returns {Promise<boolean>}
 */
const CheckFileType = async (MediaFiles, Documents) => {
    const validate = async (FileData, Format) => {
        const FileDataBuffer = new Uint8Array(FileData);
        //@ts-ignore
        const { ext } = await fileTypeFromBuffer(FileDataBuffer);
        const Size = FileData.length;
        console.log(Format.extensions.includes(ext) && Size <= Format.size)
        return Format.extensions.includes(ext) && Size <= Format.size;
    }
    for (const File of MediaFiles) {
        if (!(await validate(File.FileData, fileFormats.image)) &&
            !(await validate(File.FileData, fileFormats.video))) {
            return false
        }
    };
    for (const File of Documents) {
        if (!(await validate(File.FileData, fileFormats.document))) {
            return false
        }
    };
    return true;
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
        const Type = mime.split('/')[0];
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
    let Activity = {};
    if (!Data.ProfilePicture && !Data.CoverPicture) {
        return;
    }
    if (Data.CoverPicture) {
        Activity = { Content: "Updated their Cover Photo", MediaFiles: [{ FileUrl: Data.CoverPicture, Type: "image" }], UserId };
    } else {
        Activity = { Content: "Updated their Profile Photo", MediaFiles: [{ FileUrl: Data.ProfilePicture, Type: "image" }], UserId };
    }
    Activity = ActivityInit(Activity);
    await CreateActivities(Activity);
}

const ActivityInit = (Activity) => {
    return {
        NoOfLikes: 0,
        ...Activity,
        NoOfComments: 0,
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
    SetActivityDataForGet
}