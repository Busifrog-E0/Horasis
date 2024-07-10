import { Router } from "express";
import { decodeIDToken, ensureAuthorized } from '../middleware/auth-middleware.js';
import { PostFilesUsers, PostFilesAdmin } from '../controllers/files-controller.js'
import { ValidatePostFilesAdmin, ValidatePostFilesUser,  } from "../validations/files-validations.js";
import asyncHandler from 'express-async-handler';
import swaggerDocs from './../swaggerDocs/files-swaggerDocs.js';




const router = Router();


router.post('/files/users', decodeIDToken,
    ensureAuthorized("Admin", "Employer", "CRE", "MSI", "Manager"), ValidatePostFilesUser,
     swaggerDocs.post_files_users,
    // @ts-ignore
    asyncHandler(PostFilesUsers));


router.post('/files/admin', decodeIDToken, ensureAuthorized("Admin",),
    ValidatePostFilesAdmin, swaggerDocs.post_files_admin,
    // @ts-ignore
    asyncHandler(PostFilesAdmin));




export default router;