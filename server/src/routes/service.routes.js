import { Router } from "express";
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../controllers/service.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getServiceById);
router.post("/", authenticate, authorize("provider"), createService);
router.put("/:id", authenticate, authorize("provider"), updateService);
router.delete("/:id", authenticate, authorize("provider"), deleteService);

export default router;
