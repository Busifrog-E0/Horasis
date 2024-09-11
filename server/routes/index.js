import { Router } from 'express';

const router = Router();

// import testRoutes from "./test-routes.js";
import authRoutes from "./auth-routes.js";
import adminRoutes from "./admins-routes.js";
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
import savesRoutes from './saves-routes.js'
import translationsRoutes from './translations-routes.js'
import membersRoutes from './members-routes.js'
import analyticsRoutes from './analytics-routes.js'
import agoraRoutes from './agora-routes.js'


router.use("/api", authRoutes);
router.use("/api", adminRoutes);
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
router.use("/api", savesRoutes);
router.use("/api", translationsRoutes);
router.use("/api", membersRoutes);
router.use("/api", analyticsRoutes);
router.use("/api", agoraRoutes);





export default router;