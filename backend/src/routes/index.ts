import { Router } from "express";
import authRoutes from "./auth.route";
import vehicleRoutes from "./vehicle.route";
import purchaseRoutes from "./purchase.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/purchases", purchaseRoutes);

export default router;