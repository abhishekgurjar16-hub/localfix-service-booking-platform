import { pool } from "../config/db.js";

export const getStats = async (req, res, next) => {
  try {
    const [users, services, bookings, revenue] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM users"),
      pool.query("SELECT COUNT(*)::int AS count FROM services WHERE is_active = TRUE"),
      pool.query("SELECT COUNT(*)::int AS count FROM bookings"),
      pool.query(
        `SELECT COALESCE(SUM(s.price), 0)::numeric(12,2) AS total
         FROM bookings b
         JOIN services s ON s.id = b.service_id
         WHERE b.status IN ('accepted', 'completed')`
      )
    ]);

    res.json({
      stats: {
        users: users.rows[0].count,
        active_services: services.rows[0].count,
        bookings: bookings.rows[0].count,
        booked_value: revenue.rows[0].total
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.scheduled_at,
         b.status,
         s.title AS service_title,
         s.price,
         customer.name AS customer_name,
         provider.name AS provider_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN users customer ON customer.id = b.customer_id
       JOIN users provider ON provider.id = s.provider_id
       ORDER BY b.created_at DESC`
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
};
