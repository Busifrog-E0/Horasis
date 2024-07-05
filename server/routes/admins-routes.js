import { Router } from "express";
import { AuthAdmin, GetBanners, PatchBanners } from "../controllers/admins-controller.js";
import { ValidatePatchBanners } from "../validations/admin-validations.js";
import { decodeIDToken, ensureAuthorized } from "../middleware/auth-middleware.js";

const router = Router();


router.post('/admin/login', async (req, res) => {
    return AuthAdmin(req, res);
});

router.patch('/admin/banners', decodeIDToken, ensureAuthorized("Admin"),
    ValidatePatchBanners, PatchBanners);

router.get('/admin/banners', async (req, res) => {
    return GetBanners(req, res);
});


export default router;

