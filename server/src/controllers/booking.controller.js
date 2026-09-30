import { pool } from "../config/db.js";

export const createBooking = async (req, res, next) => {
  try {
    const { service_id, scheduled_at, notes } = req.body;

    if (!service_id || !scheduled_at) {
      return res.status(400).json({ message: "Service and scheduled time are required." });
    }

    const scheduledDate = new Date(scheduled_at);

    if (Number.isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return res.status(400).json({ message: "Please select a valid future date and time." });
    }

    const service = await pool.query(
      "SELECT id, title, is_active FROM services WHERE id = $1",
      [service_id]
    );

    if (!service.rowCount || !service.rows[0].is_active) {
      return res.status(404).json({ message: "Service is not available." });
    }

    try {
      const result = await pool.query(
        `INSERT INTO bookings (customer_id, service_id, scheduled_at, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.user.id, service_id, scheduledDate.toISOString(), notes?.trim() || null]
      );

      res.status(201).json({ booking: result.rows[0] });
    } catch (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          message: "That service slot is already booked. Please choose another time."
        });
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.scheduled_at,
         b.status,
         b.notes,
         b.created_at,
         s.title AS service_title,
         s.category,
         s.price,
         s.location,
         u.name AS provider_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users u ON u.id = s.provider_id
       WHERE b.customer_id = $1
       ORDER BY b.scheduled_at DESC`,
      [req.user.id]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getProviderBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.scheduled_at,
         b.status,
         b.notes,
         b.created_at,
         s.title AS service_title,
         s.price,
         s.location,
         u.name AS customer_name,
         u.email AS customer_email,
         u.phone AS customer_phone
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users u ON u.id = b.customer_id
       WHERE s.provider_id = $1
       ORDER BY b.scheduled_at DESC`,
      [req.user.id]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["accepted", "rejected", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking status." });
    }

    const current = await pool.query(
      `SELECT
         b.id,
         b.status,
         b.customer_id,
         s.provider_id
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       WHERE b.id = $1`,
      [req.params.id]
    );

    if (!current.rowCount) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const booking = current.rows[0];

    const isProvider = booking.provider_id === req.user.id;
    const isCustomer = booking.customer_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isProvider && !isCustomer && !isAdmin) {
      return res.status(403).json({ message: "You cannot update this booking." });
    }

    if (isCustomer && status !== "cancelled") {
      return res.status(403).json({ message: "Customers can only cancel their booking." });
    }

    if (booking.status === "completed" || booking.status === "rejected" || booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking can no longer be changed." });
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    res.json({ booking: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
    }

    const bookingResult = await pool.query(
      `SELECT b.id, b.customer_id, b.service_id, b.status
       FROM bookings b
       WHERE b.id = $1`,
      [req.params.bookingId]
    );

    if (!bookingResult.rowCount) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const booking = bookingResult.rows[0];

    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ message: "You can only review your own booking." });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Only completed bookings can be reviewed." });
    }

    const result = await pool.query(
      `INSERT INTO reviews (booking_id, customer_id, service_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [booking.id, booking.customer_id, booking.service_id, numericRating, comment?.trim() || null]
    );

    res.status(201).json({ review: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: "You have already reviewed this booking." });
    }
    next(error);
  }
};
