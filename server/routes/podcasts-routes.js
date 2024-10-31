import {
    GetOneFromPodcasts, GetPodcasts, PostPodcasts, PatchPodcasts, DeletePodcasts,
    GetUserPodcasts,
    GetInvitedPodcasts,
    GetPublicPodcasts,
} from '../controllers/podcasts-controller.js';
import asyncHandler from 'express-async-handler';


import SwaggerDocs from '../swaggerDocs/podcasts-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidatePatchPodcastCoverPhoto, ValidatePostPodcast } from '../validations/podcasts-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
const router = e.Router();


router.get('/podcasts', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Podcasts,
    //@ts-ignore
    asyncHandler(GetPodcasts));

router.get('/podcasts/:PodcastId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetOneFromPodcasts));

router.post('/podcasts', decodeIDToken, ensureAuthorized("User"), ValidatePostPodcast, SwaggerDocs.post_Podcast,
    // @ts-ignore
    asyncHandler(PostPodcasts));

router.patch('/podcasts/:PodcastId/coverPicture', decodeIDToken, ensureAuthorized("User"), ValidatePatchPodcastCoverPhoto,
    SwaggerDocs.patch_Podcast_PodcastId_CoverPicture,
    // @ts-ignore
    asyncHandler(PatchPodcasts));

router.get('/guest/podcasts/', ValidateGetEntity, QueryParameterFormatting, SwaggerDocs.get_Guest_Podcasts,
    //@ts-ignore
    asyncHandler(GetPublicPodcasts));

/*********************************************************************FILTERED DISCUSSIONS********************************************************************* */

router.get('/user/:UserId/podcasts', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_User_UserId_Podcasts,
    //@ts-ignore
    asyncHandler(GetUserPodcasts))

router.get('/user/:UserId/podcasts/invited', decodeIDToken, ensureAuthorized("User"), ValidateGetEntity, QueryParameterFormatting,
    SwaggerDocs.get_Podcasts_Invited,
    //@ts-ignore
    asyncHandler(GetInvitedPodcasts));


router.delete('/podcasts/:PodcastId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeletePodcasts));

export default router;