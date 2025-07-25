import e from 'express'
import { AlertBoxObject } from "../controllers/common.js";
import { ReadMembers } from "../databaseControllers/members-databaseController.js";
import { EntityTypes } from './common.js';
import { ReadOneFromDiscussions } from '../databaseControllers/discussions-databaseController.js';
import { ReadOneFromEvents } from '../databaseControllers/events-databaseController.js';


/**
 * 
 * @param {e.Request} req 
 * @param {e.Response} res 
 * @param {Function} next 
 * @returns 
 */
const MemberPostActivityMiddleware = async (req, res, next) => {
    /**
     * @type {{ MediaFiles: { FileUrl : string ,Type: "image"|"video" }[]; }}
     */
    const { MediaFiles } = req.body;
    const Entity = req.body.Type === "Discussion" ? await ReadOneFromDiscussions(req.params.EntityId) : await ReadOneFromEvents(req.params.EntityId);
    //@ts-ignore
    const Member = await ReadMembers({ MemberId: req.user.UserId, EntityId: req.params.EntityId }, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You need to be a member to post"));
    }
    const { Permissions } = Member[0];
    if (!Entity.MemberPermissions.CanPostActivity && !Permissions.CanPostActivity) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You cannot post in this discussion"));
    }

    const hasMultipleMedia = MediaFiles.length > 1;
    if (hasMultipleMedia && !Entity.MemberPermissions.CanCreateAlbum && !Permissions.CanCreateAlbum) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to create albums"));
    }

    const hasImageMedia = MediaFiles.some(file => file.Type === 'image');
    if (hasImageMedia && !Entity.MemberPermissions.CanUploadPhoto && !Permissions.CanUploadPhoto) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to upload images"));
    }

    const hasVideoMedia = MediaFiles.some(file => file.Type === 'video');
    if (hasVideoMedia && !Entity.MemberPermissions.CanUploadVideo && !Permissions.CanUploadVideo) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to upload videos"));
    }

    return next();
}

const InsertEntityTypeMiddleware = async (req, res, next) => {
    const { EntityType } = req.params;
    req.body.Type = EntityTypes[EntityType];
    return next();
}

export {
    MemberPostActivityMiddleware,
    InsertEntityTypeMiddleware
}