import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../controllers/vehicle.controller";
import { authenticate, authorizeRole } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, authorizeRole("ADMIN"), createVehicle);
router.get("/search", authenticate, searchVehicles);
router.get("/", authenticate, getVehicles);
router.get("/:id", authenticate, getVehicleById);
router.put("/:id", authenticate, authorizeRole("ADMIN"), updateVehicle);
router.delete("/:id", authenticate, authorizeRole("ADMIN"), deleteVehicle);
router.post("/:id/purchase", authenticate, purchaseVehicle);
router.post("/:id/restock", authenticate, authorizeRole("ADMIN"), restockVehicle);

export default router;
