import { Router } from 'express';

const router = Router();

// import testRoutes from "./test-routes.js";
import authRoutes from "./auth-routes.js";
// import adminRoutes from "./admins-routes.js";
import userRoutes from "./users-routes.js";
import followRoutes from './follow-routes.js';
import connectionsRoutes from './connections-routes.js';
import filesRoutes from './files-routes.js'
import activitiesRoutes from './activities-routes.js'
import commentsRoutes from './comments-routes.js'


router.use("/api", authRoutes);
// router.use("/api", adminRoutes);
router.use("/api", userRoutes);
// router.use("/api", fileRoutes);
router.use("/api", followRoutes);
router.use("/api", connectionsRoutes);
router.use("/api", filesRoutes);
router.use("/api", activitiesRoutes);
router.use("/api", commentsRoutes);







export default router;