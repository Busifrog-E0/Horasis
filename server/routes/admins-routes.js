import { Router } from "express";
import { AuthAdmin, PatchAdmin, } from "../controllers/admins-controller.js";
import { decodeIDToken, ensureAuthorized } from "../middleware/auth-middleware.js";
import asyncHandler from 'express-async-handler';
import { QueryParameterFormatting } from '../middleware/common.js';
import { AddUserAsAdmin, GetUsersByRole, RemoveUserAsAdmin } from "../controllers/users-controller.js";
import { ValidateAdmin, ValidateGetUsersByRole, ValidateAddAdmin, ValidateRemoveAdmin, ValidateSendNotificationToAllUsersByAdmin } from "../validations/admins-validations.js";
const router = Router();
import SwaggerDocs from '../swaggerDocs/admins-swaggerDocs.js'
import { SendNotificationToAllUsersByAdmin } from "../controllers/notifications-controller.js";

router.post('/admin/login', ValidateAdmin,
    //@ts-ignore
    asyncHandler(AuthAdmin));

router.patch('/admin', decodeIDToken, ensureAuthorized("SuperAdmin"), ValidateAdmin, SwaggerDocs.patch_Admin,
    //@ts-ignore
    asyncHandler(PatchAdmin));

router.get('/admin/users', decodeIDToken, ensureAuthorized("SuperAdmin"), ValidateGetUsersByRole, QueryParameterFormatting, SwaggerDocs.get_Admin_Users,
    //@ts-ignore
    asyncHandler(GetUsersByRole));

router.patch('/admin/addAdmin', decodeIDToken, ensureAuthorized("SuperAdmin"), ValidateAddAdmin, SwaggerDocs.patch_Admin_AddAdmin,
    //@ts-ignore
    asyncHandler(AddUserAsAdmin));

router.patch('/admin/removeAdmin', decodeIDToken, ensureAuthorized("SuperAdmin"), ValidateRemoveAdmin, SwaggerDocs.patch_Admin_RemoveAdmin,
    //@ts-ignore
    asyncHandler(RemoveUserAsAdmin));

router.post('/admin/sendNotification/all', decodeIDToken, ensureAuthorized("SuperAdmin", "Admin"),
    ValidateSendNotificationToAllUsersByAdmin, SendNotificationToAllUsersByAdmin);

export default router;

