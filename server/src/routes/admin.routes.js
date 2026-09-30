import { Router } from "express";
import { getStats, getAllBookings, getAllUsers } from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get("/stats", getStats);
router.get("/bookings", getAllBookings);
router.get("/users", getAllUsers);

export default router;
