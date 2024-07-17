import e from 'express';

import { ReadOneFromActivities, ReadActivities, UpdateActivities, CreateActivities, RemoveActivities, UpdateAndIncrementActivities, } from '../databaseControllers/activities-databaseController.js';
import { fileTypeFromBuffer } from 'file-type';
import { AsyncSaveFileToSpaces, fileFormats,  } from './files-controller.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadFollows } from '../databaseControllers/follow-databaseController.js';
import { ReadConnections } from '../databaseControllers/connections-databaseController.js';
import { ObjectId } from 'mongodb';

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
    const { UserId } = req.params;
    const [Follows, Connections] = await Promise.all([
        await ReadFollows({ FollowerId: UserId }, undefined, -1, undefined),
        await ReadConnections({ UserIds: UserId, Status: "Connected" }, undefined, -1, undefined)
    ])
    const FollowerIds = Follows.map(Follow => Follow.DocId);
    const ConnectedIds = Connections.map(Connection => {
        const [Id1, Id2] = Connection.UserIds;
        return Id1 === UserId ? Id2 : Id1;
    })
    const UserIds = [...new Set([...FollowerIds, ...ConnectedIds])]
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    Filter.UserId = { "$in": UserIds };
    //@ts-ignore
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
    const { Content } = req.body;
    let { MediaFiles, Documents } = req.body;
    const ActivityId = (new ObjectId()).toString();
    //@ts-ignore
    const { UserId } = req.user;
    const ValidateFiles = await CheckFileType(MediaFiles, Documents);
    if (!ValidateFiles) {
        return res.status(444).json(AlertBoxObject("Can't upload","File(s) cannot be uploaded"))
    }
    const Attachments = await UploadFiles(MediaFiles, Documents, UserId, ActivityId);
    const Mentions = await ExtractMentionedUsersFromContent(Content);
    req.body = ActivityInit(req.body);
    //@ts-ignore
    const data = { ...req.body, Documents : Attachments.DocumentsLinks, MediaFiles : Attachments.MediaFilesLinks, Mentions };
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


const CheckFileType = async (MediaFiles, Documents) => {
    const validate =async (FileData, Format) => {
        const FileDataBuffer = new Uint8Array(FileData);
        //@ts-ignore
        const  {ext}  = await fileTypeFromBuffer(FileDataBuffer);
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
    for(const File of Documents) {
        if (!(await validate(File.FileData, fileFormats.document))) {
            return false
        }
    };
    return true;
}

const UploadFiles = async (MediaFiles, Documents,UserId,ActivityId) => {
    const MediaFilesLinks = await Promise.all(MediaFiles.map(async File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const { mime } = await fileTypeFromBuffer(FileBuffer);
        const link = await AsyncSaveFileToSpaces(UserId, `${ActivityId}/${FileName}`, FileData, mime)
        console.log(link)
        return  link
    }));
    const DocumentsLinks = await Promise.all(Documents.map(async File => {
        const { FileData, FileName } = File;
        const FileBuffer = new Uint8Array(FileData)
        //@ts-ignore
        const {  mime } = await fileTypeFromBuffer(FileBuffer);
        return  AsyncSaveFileToSpaces(UserId,`${ActivityId}/${FileName}`, FileData, mime)
    }));
    return { MediaFilesLinks, DocumentsLinks };
}




const PostActivityForProfilePatch = async (Data, UserId) => {
    let Activity = {}
    if (Data.CoverPicture) {
        Activity = { Content: "Updated his Cover Photo", UserId };
    }
    if (Data.ProfilePicture) {
        Activity = { Content: "Updated his Profile Photo", UserId };
    }
    Activity = ActivityInit(Activity);
    await CreateActivities(Activity);
    return;
}

const ActivityInit = (Activity) => {
    return {
        NoOfLikes: 0,
        ...Activity,
        NoOfComments: 0,
        LikedIds: []
    }
}
/**
 * 
 * @param {string} Content 
 * @returns 
 */
const ExtractMentionedUsersFromContent = async (Content) => {
    const mentionPattern = /(?<=\s|^)@(\w+)/g;
    const mentions = Content.match(mentionPattern);
    let Users = [];
    if (mentions) {
        await Promise.all([mentions.map(async mention => {
            const Username = mention.slice(1);
            const User = await ReadUsers({ Username }, undefined, 1, undefined);
            if (User.length > 0) {
                Users.push({ Username, UserId: User[0].DocId })
            }
        })])
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
    const { LikedIds, DocId } = await ReadOneFromActivities(ActivityId);
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
    await UpdateAndIncrementActivities({ LikedIds: NewLikedIds }, { NoOfLikes: -1 }, DocId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetLikedUsers = async (req, res) => {
    const { ActivityId } = req.params;
    const { LikedIds } = await ReadOneFromActivities(ActivityId);
    const LikedUsers = await Promise.all(LikedIds.map(async UserId => {
        return await ReadOneFromUsers(UserId);
    }))
    return res.json(LikedUsers);
}


export {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    LikeAnActivity, DislikeAnActivity, GetLikedUsers, PostActivityForProfilePatch
}