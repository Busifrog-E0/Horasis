import e from 'express';

import { ReadOneFromActivities, ReadActivities, UpdateActivities, CreateActivities, RemoveActivities, UpdateAndIncrementActivities, AggregateActivities, } from '../databaseControllers/activities-databaseController.js';
import { fileTypeFromBuffer } from 'file-type';
import { AsyncSaveFileToSpaces, fileFormats, } from './files-controller.js';
import { ReadOneFromUsers, ReadUsers } from '../databaseControllers/users-databaseController.js';
import { AlertBoxObject } from './common.js';
import { ReadFollows } from '../databaseControllers/follow-databaseController.js';
import { ReadConnections } from '../databaseControllers/connections-databaseController.js';
import { ObjectId } from 'mongodb';
import { ReadLikes } from '../databaseControllers/likes-databaseController.js';

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
    const UserDetails = await ReadOneFromUsers(Activity.UserId);
    const checkLike = await ReadLikes({ ActivityId: Activity.DocId, UserId }, undefined, 1, undefined);
    const HasLiked = checkLike.length > 0 ? true : false;
    return res.json({...Activity,UserDetails,HasLiked});
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
    const { Filter, NextId, Limit, OrderBy } = req.query;
    const AggregateArray = [
        {
            '$lookup': {
                'from': 'Follows',
                'pipeline': [
                    { '$match': { '$expr': { '$eq': ['$FollowerId', UserId] } } }       //INSERTS FOLLOWEES ARRAY
                ],
                'as': 'Followees'
            }
        },
        {
            '$lookup': {
                'from': 'Connections',
                'pipeline': [
                    { '$match': { '$expr': { '$in': [UserId, '$UserIds'] } } }      //INSERTS CONNECTIONS ARRAY
                ],
                'as': 'Connections'
            }
        },
        {
            $addFields: {
                Followees: { $map: { input: '$Followees', as: 'f', in: '$$f.FolloweeId' } },    //CHANGES FOLLOWEES ARRAY TO CONTAIN IDS
                Connections: {                                                                  //CHANGES CONNECTION ARRAY TO CONTAIN IDS
                    $reduce: {
                        input: '$Connections',
                        initialValue: [],
                        in: { $setUnion: ['$$value', '$$this.UserIds'] }                //UNIONS ARRAY WITH USERIDS ARRAY
                    }
                }
            }
        },
        {
            $addFields: {
                UserIds: { $setUnion: ['$Followees', '$Connections'] }                  
            }
        },
        {
            $match: {
                $expr: { $in: ['$UserId', '$UserIds'] }
            }
        },
        { $sort: { Index: -1, _id: -1 } },
        { $limit: Limit },
        {
            $lookup: {
                from: 'Users',
                let: { userObjectId: { $toObjectId: '$UserId' } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$userObjectId'] } } }
                ],
                as: 'UserDetails'                                                                 //INSERTS USERDETAILS ARRAY
            }
        },
        {
            $addFields: {
                UserDetails : { $arrayElemAt : ['$UserDetails',0]}                                 //ARRAY TO OBJECT
            }
        },
        {
            $lookup: {
                from: 'Likes',
                let: { activityId: { $toString: '$_id' }, userId: UserId },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [                                                                     //INSERTS HASLIKED ARRAY
                                    { $eq: ['$ActivityId', '$$activityId'] },
                                    { $eq: ['$UserId', '$$userId'] }
                                ]
                            }
                        }
                    }
                ],
                as: 'HasLiked'                                                              
            }
        },
        {
            $addFields: {
                HasLiked: { $gt: [{ $size: '$HasLiked' }, 0] }                              //CONVERTS TO BOOLEAN
            }
        },
        {
            $project: {
                Followees: 0,
                Connections: 0,                                                             //REMOVE UNNECESSARY FIELDS
                UserIds: 0
            }
        }

    ]
    if (NextId) {
        //@ts-ignore
        const [Index, nextId] = NextId.split('--');
        AggregateArray.splice(5, 0, {
            $match:
            {//@ts-ignore
                $expr: {
                    $or: [
                        { $lt: ['$Index', Index] },
                        {
                            $and: [
                                { $eq: ['$Index', Index] },
                                { $lt: ['$_id', new ObjectId(nextId)] }
                            ]
                        }
                    ],
                }
            }
        });
    }
    const data = await AggregateActivities(AggregateArray);
    return res.json(data);
};

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns 
 */
const GetUserActivities = async (req, res) => {
    const { UserId } = req.params;
    const { Filter, NextId, Limit, OrderBy } = req.query;
    //@ts-ignore
    Filter.UserId = UserId;
    const UserDetails = await ReadOneFromUsers(UserId);
    //@ts-ignore
    const Activities = await ReadActivities(Filter, NextId, Limit, OrderBy);
    const data = await Promise.all(Activities.map(async Activity => {
        const checkLike = await ReadLikes({ ActivityId: Activity.DocId, UserId }, undefined, 1, undefined);
        const HasLiked = checkLike.length > 0 ? true : false;
        return {...Activity,UserDetails,HasLiked}
    }))
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
    const data = { ...req.body, Documents: Attachments.DocumentsLinks, MediaFiles: Attachments.MediaFilesLinks, Mentions };
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
    //@ts-ignore
    const { UserId } = req.user;
    const Activity = await ReadOneFromActivities(ActivityId);
    if (Activity.UserId !== UserId) {
        return res.status(444).json(AlertBoxObject("Cannot Delete","Cannot delete other User's Activity"))
    }
    await RemoveActivities(ActivityId);
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
    }
}
/**
 * 
 * @param {string} Content 
 * @returns 
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
                Users.push({ Username, UserId: User[0].DocId })
            }
        }))
    }
    return Users;
};





export {
    GetOneFromActivities, GetActivities, PostActivities, PatchActivities, DeleteActivities,
    PostActivityForProfilePatch,GetUserActivities
}