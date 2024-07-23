import e from 'express'
import { AlertBoxObject } from "../controllers/common.js";
import { ReadMembers } from "../databaseControllers/members-databaseController.js";
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
    //@ts-ignore
    const Member = await ReadMembers({ MemberId: req.user.UserId, EntityId: req.params.EntityId }, undefined, 1, undefined);
    if (Member.length === 0) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You need to be a member to post"));
    }
    const { Permissions } = Member[0];
    if (!Permissions.CanPostActivity) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You cannot post in this discussion"));
    }

    const hasMultipleMedia = MediaFiles.length > 1;
    if (hasMultipleMedia && !Permissions.CanCreateAlbum) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to create albums"));
    }

    const hasImageMedia = MediaFiles.some(file => file.Type === 'image');
    if (hasImageMedia && !Permissions.CanUploadPhoto) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to upload images"));
    }

    const hasVideoMedia = MediaFiles.some(file => file.Type === 'video');
    if (hasVideoMedia && !Permissions.CanUploadVideo) {
        return res.status(444).json(AlertBoxObject("Cannot Post", "You do not have permission to upload videos"));
    }

    return next();
}

export {
    MemberPostActivityMiddleware
}