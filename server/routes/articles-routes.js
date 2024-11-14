import {
    GetOneFromArticles, GetArticles, PostArticles, PatchArticles, DeleteArticles,
} from '../controllers/articles-controller.js';
import asyncHandler from 'express-async-handler';
import SwaggerDocs from '../swaggerDocs/articles-swaggerDocs.js'
import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { ValidateGetArticles, ValidatePatchArticles, ValidatePatchArticlesCoverPicture, ValidatePostArticles } from '../validations/articles-validations.js';
import { QueryParameterFormatting, ValidateGetEntity } from '../middleware/common.js';
import { InsertArticleTypeMiddleware } from '../middleware/articles-middleware.js';
import { DeleteSaves, GetSaves, PostSaves } from '../controllers/saves-controller.js';
const router = e.Router();

router.get('/articles', decodeIDToken, ensureAuthorized("User"), ValidateGetArticles, QueryParameterFormatting,
    SwaggerDocs.get_Articles,
    // @ts-ignore
    asyncHandler(GetArticles));

router.get('/articles/:ArticleId', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.get_Articles_ArticleId,
    // @ts-ignore
    asyncHandler(GetOneFromArticles));
/* 
router.post('/articles/:EntityId/save', decodeIDToken, ensureAuthorized("User"), InsertArticleTypeMiddleware,
    SwaggerDocs.post_Articles_ArticleId_Save,
    // @ts-ignore
    asyncHandler(PostSaves));

router.get('/users/:UserId/articles/save', decodeIDToken, ensureAuthorized("User"), InsertArticleTypeMiddleware,
    SwaggerDocs.get_Articles_ArticleId_Save,
    //@ts-ignore
    asyncHandler(GetSaves));

router.delete('/articles/:EntityId/save', decodeIDToken, ensureAuthorized("User"),
    SwaggerDocs.delete_Articles_ArticleId_Save,
    //@ts-ignore
    asyncHandler(DeleteSaves));
 */

router.post('/articles', decodeIDToken, ensureAuthorized("User"), ValidatePostArticles,
    SwaggerDocs.post_Articles,
    // @ts-ignore
    asyncHandler(PostArticles));

router.patch('/articles/:ArticleId', decodeIDToken, ensureAuthorized("User"), ValidatePatchArticles,
    SwaggerDocs.patch_Articles_ArticleId,
    // @ts-ignore
    asyncHandler(PatchArticles));


router.patch('/articles/:ArticleId/coverPicture', decodeIDToken, ensureAuthorized("User"), ValidatePatchArticlesCoverPicture,
    SwaggerDocs.patch_Articles_ArticleId_CoverPicture,
    // @ts-ignore
    asyncHandler(PatchArticles));

router.delete('/articles/:ArticleId', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(DeleteArticles));

export default router;