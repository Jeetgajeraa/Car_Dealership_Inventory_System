import { Router } from "express";
import { getUserPurchases } from "../controllers/purchase.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getUserPurchases);

export default router;
