import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
} from "../controllers/vehicle.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, authorizeRole("ADMIN"), createVehicle);
router.get("/search", authenticate, searchVehicles);
router.get("/", authenticate, getVehicles);
router.put("/:id", authenticate, authorizeRole("ADMIN"), updateVehicle);

export default router;
