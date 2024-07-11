import e from 'express';

import { ReadOneFromPosts, ReadPosts, UpdatePosts, CreatePosts, RemovePosts, } from './../databaseControllers/posts-databaseController.js';
import { GetFileFromURI } from './common.js';
import { fileTypeFromBuffer } from 'file-type';
/**
 * @typedef {import('./../databaseControllers/posts-databaseController.js').PostData} PostData 
 */

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<PostData>>}
 */
const GetOneFromPosts = async (req, res) => {
    const { PostId } = req.params;
    const data = await ReadOneFromPosts(PostId);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<Array<PostData>>>}
 */
const GetPosts = async (req, res) => {
    const { Filter, NextId, Limit, OrderBy } = req.query;
    // @ts-ignore
    const data = await ReadPosts(Filter, NextId, Limit, OrderBy);
    return res.json(data);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PostPosts = async (req, res) => {
    const { Attatchments } = req.body;
    const SeperatedAttatchments = await Promise.all(Attatchments.map(async Uri => {
        const File = await GetFileFromURI(Uri);
        //@ts-ignore
        const { mime: FileType } = fileTypeFromBuffer(File);
        
    }))
    await CreatePosts(req.body);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const PatchPosts = async (req, res) => {
    const { PostId } = req.params;
    await UpdatePosts(req.body, PostId);
    return res.json(true);
}

/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @returns {Promise<e.Response<true>>}
 */
const DeletePosts = async (req, res) => {
    const { PostId } = req.params;
    await RemovePosts(PostId);
    return res.json(true);
}


export {
    GetOneFromPosts, GetPosts, PostPosts, PatchPosts, DeletePosts
}