import { Router } from "express";
import authRoutes from "./auth.route";
import vehicleRoutes from "./vehicle.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);

export default router;