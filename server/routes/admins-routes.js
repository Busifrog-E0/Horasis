import { Router } from "express";
import { AuthAdmin, GetBanners, PatchBanners } from "../controllers/admins-controller.js";
import { decodeIDToken, ensureAuthorized } from "../middleware/auth-middleware.js";

const router = Router();


router.post('/admin/login', async (req, res) => {
    return AuthAdmin(req, res);
});


export default router;

