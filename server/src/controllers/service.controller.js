import { pool } from "../config/db.js";

export const listServices = async (req, res, next) => {
  try {
    const { search = "", category = "" } = req.query;

    const result = await pool.query(
      `SELECT
         s.id,
         s.title,
         s.description,
         s.category,
         s.price,
         s.duration_minutes,
         s.location,
         s.image_url,
         s.provider_id,
         u.name AS provider_name
       FROM services s
       JOIN users u ON u.id = s.provider_id
       WHERE s.is_active = TRUE
         AND ($1 = '' OR s.title ILIKE '%' || $1 || '%' OR s.description ILIKE '%' || $1 || '%')
         AND ($2 = '' OR s.category = $2)
       ORDER BY s.created_at DESC`,
      [search.trim(), category.trim()]
    );

    res.json({ services: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
         s.*,
         u.name AS provider_name,
         u.phone AS provider_phone,
         COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS average_rating,
         COUNT(r.id)::int AS review_count
       FROM services s
       JOIN users u ON u.id = s.provider_id
       LEFT JOIN reviews r ON r.service_id = s.id
       WHERE s.id = $1 AND s.is_active = TRUE
       GROUP BY s.id, u.name, u.phone`,
      [req.params.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Service not found." });
    }

    const reviews = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS customer_name
       FROM reviews r
       JOIN users u ON u.id = r.customer_id
       WHERE r.service_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    res.json({
      service: result.rows[0],
      reviews: reviews.rows
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      price,
      duration_minutes,
      location,
      image_url
    } = req.body;

    if (!title || !description || !category || price === undefined || !duration_minutes || !location) {
      return res.status(400).json({ message: "All service fields are required." });
    }

    const result = await pool.query(
      `INSERT INTO services
       (provider_id, title, description, category, price, duration_minutes, location, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.id,
        title.trim(),
        description.trim(),
        category.trim(),
        Number(price),
        Number(duration_minutes),
        location.trim(),
        image_url?.trim() || null
      ]
    );

    res.status(201).json({ service: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      price,
      duration_minutes,
      location,
      image_url
    } = req.body;

    const result = await pool.query(
      `UPDATE services
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category = COALESCE($3, category),
           price = COALESCE($4, price),
           duration_minutes = COALESCE($5, duration_minutes),
           location = COALESCE($6, location),
           image_url = COALESCE($7, image_url)
       WHERE id = $8 AND provider_id = $9
       RETURNING *`,
      [
        title?.trim() || null,
        description?.trim() || null,
        category?.trim() || null,
        price === undefined ? null : Number(price),
        duration_minutes === undefined ? null : Number(duration_minutes),
        location?.trim() || null,
        image_url?.trim() || null,
        req.params.id,
        req.user.id
      ]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Service not found or not owned by you." });
    }

    res.json({ service: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE services
       SET is_active = FALSE
       WHERE id = $1 AND provider_id = $2
       RETURNING id`,
      [req.params.id, req.user.id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Service not found or not owned by you." });
    }

    res.json({ message: "Service deactivated successfully." });
  } catch (error) {
    next(error);
  }
};
