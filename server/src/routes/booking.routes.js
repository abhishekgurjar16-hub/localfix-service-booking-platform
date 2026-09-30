import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  createReview
} from "../controllers/booking.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, authorize("customer"), createBooking);
router.get("/my", authenticate, authorize("customer"), getMyBookings);
router.get("/provider", authenticate, authorize("provider"), getProviderBookings);
router.patch("/:id/status", authenticate, updateBookingStatus);
router.post("/:bookingId/review", authenticate, authorize("customer"), createReview);

export default router;
