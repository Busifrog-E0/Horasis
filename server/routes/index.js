import { Router } from 'express';

const router = Router();

// import testRoutes from "./test-routes.js";
import authRoutes from "./auth-routes.js";
// import adminRoutes from "./admins-routes.js";
import userRoutes from "./users-routes.js";



router.use("/api", authRoutes);
// router.use("/api", adminRoutes);
router.use("/api", userRoutes);
// router.use("/api", fileRoutes);





export default router;