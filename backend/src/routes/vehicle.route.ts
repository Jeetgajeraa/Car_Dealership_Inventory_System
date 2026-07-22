import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  searchVehicles,
} from "../controllers/vehicle.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, authorizeRole("ADMIN"), createVehicle);
router.get("/search", authenticate, searchVehicles);
router.get("/", authenticate, getVehicles);

export default router;
