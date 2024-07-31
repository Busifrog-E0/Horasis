import e from 'express';

import { ReadOneFromMedias, ReadMedias, UpdateMedias, CreateMedias, RemoveMedias, } from './../databaseControllers/medias-databaseController.js';
/**
 * @typedef {{ MediaFilesLinks : {FileUrl : string,Type : "image"|"video"}[] , DocumentsLinks : string[] } } Attachments
 */


/**
 * @typedef {import('./../databaseControllers/medias-databaseController.js').MediaData} MediaData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<MediaData>>}
 */
const GetOneFromMedias = async (req, res) => {
    const { MediaId } = req.params;
    const data = await ReadOneFromMedias(MediaId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<MediaData>>>}
 */
const GetMedias = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    //@ts-ignore
    Filter.UserId = req.params.UserId;
    // @ts-ignore
    const data = await ReadMedias(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostMedias = async (req, res) => {
    await CreateMedias(req.body);
    return res.json(true);
}

/**
 * 
 * @param {Attachments} Attachments 
 * @param {string} EntityId
 * @param {string} UserId
 */
const PostMediasFromAttachments = async (Attachments,EntityId,UserId) => {
    const promises = [];
    if (Attachments.MediaFilesLinks) { 
        promises.push(Attachments.MediaFilesLinks.map(async MediaFile => {
            await CreateMedias({ ...MediaFile, EntityId , UserId });
        }))
    };
    if (Attachments.DocumentsLinks) {
        promises.push(Attachments.DocumentsLinks.map(async Document => {
            await CreateMedias({ FileUrl : Document , Type : "document", EntityId,UserId });
         }))
    }
    await Promise.all(promises);
    return true;
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchMedias = async (req, res) => {
    const { MediaId } = req.params;
    await UpdateMedias(req.body, MediaId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeleteMedias = async (req, res) => {
    const { MediaId } = req.params;
    await RemoveMedias(MediaId);
    return res.json(true);
}


export {
    GetOneFromMedias, GetMedias, PostMedias, PatchMedias, DeleteMedias,
    PostMediasFromAttachments
}