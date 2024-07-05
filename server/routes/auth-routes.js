import { Router } from "express";
import { ModelLogin, RefreshToken } from "../controllers/auth-controller.js";

const router = Router();

router.post('/ModelLogin', async (req, res) => {
    return ModelLogin(req, res);
});

router.post('/RefreshToken', async (req, res) => {
    return RefreshToken(req, res);
});

export default router;