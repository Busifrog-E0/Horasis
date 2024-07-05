import { Router } from 'express';

const router = Router();

// import testRoutes from "./test-routes.js";
import authRoutes from "./auth-routes.js";
import adminRoutes from "./admins-routes.js";
import categoryRoutes from "./categories-routes.js";
import questionRoutes from "./questions-routes.js";
import userRoutes from "./users-routes.js";
import normalQuizRoutes from "./normalQuizzes-routes.js";
import surveysRoutes from "./surveys-routes.js";
import fileRoutes from "./files-routes.js";
import luckRoutes from "./lucks-routes.js";



router.use("/api", authRoutes);
router.use("/api", adminRoutes);
router.use("/api", categoryRoutes);
router.use("/api", questionRoutes);
router.use("/api", userRoutes);
router.use("/api", fileRoutes);
router.use("/api", normalQuizRoutes);
router.use("/api", surveysRoutes);
router.use("/api", luckRoutes);





export default router;