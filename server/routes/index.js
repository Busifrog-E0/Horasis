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
import chatsRoutes from './chats-routes.js'
import discussionRoutes from './discussions-routes.js'
import eventsRoutes from './events-routes.js'
import articlesRoutes from './articles-routes.js'

router.use("/api", authRoutes);
// router.use("/api", adminRoutes);
router.use("/api", userRoutes);
// router.use("/api", fileRoutes);
router.use("/api", followRoutes);
router.use("/api", connectionsRoutes);
router.use("/api", filesRoutes);
router.use("/api", activitiesRoutes);
router.use("/api", commentsRoutes);
router.use("/api", chatsRoutes);
router.use("/api", discussionRoutes);
router.use("/api", eventsRoutes);
router.use("/api", articlesRoutes);







export default router;