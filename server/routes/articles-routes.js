import {
    GetOneFromArticles, GetArticles, PostArticles, PatchArticles, DeleteArticles,
} from '../controllers/articles-controller.js';
import asyncHandler from 'express-async-handler';

import e from 'express';
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
const router = e.Router();

router.get('/articles', decodeIDToken, ensureAuthorized("User"),
    // @ts-ignore
    asyncHandler(GetArticles));

router.get('/articles/:ArticleId',
    // @ts-ignore
    asyncHandler(GetOneFromArticles));

router.post('/articles',
    // @ts-ignore
    asyncHandler(PostArticles));

router.patch('/articles/:ArticleId',
    // @ts-ignore
    asyncHandler(PatchArticles));

router.delete('/articles/:ArticleId',
    // @ts-ignore
    asyncHandler(DeleteArticles));

export default router;