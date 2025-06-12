import { Router } from "express";
import { ModelLogin, RefreshToken, UserLogout } from "../controllers/auth-controller.js";

const router = Router();

router.post('/ModelLogin', async (req, res) => {
    return ModelLogin(req, res);
});

router.post('/RefreshToken', async (req, res) => {
    return RefreshToken(req, res);
});


router.post('/UserLogout', async (req, res) => {
    return UserLogout(req, res);
});



export default router;