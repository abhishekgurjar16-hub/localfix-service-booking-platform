import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool } from "./config/db.js";

dotenv.config();

const seed = async () => {
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const providerHash = await bcrypt.hash("Provider@123", 10);

  const adminResult = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('servora Admin', 'admin@example.com', $1, 'admin')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id`,
    [adminHash]
  );

  const providerResult = await pool.query(
    `INSERT INTO users (name, email, password_hash, phone, role)
     VALUES ('Rahul Sharma', 'provider@example.com', $1, '9876543210', 'provider')
     ON CONFLICT (email)
     DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id`,
    [providerHash]
  );

  const providerId = providerResult.rows[0].id;

  const serviceCount = await pool.query(
    "SELECT COUNT(*)::int AS count FROM services WHERE provider_id = $1",
    [providerId]
  );

  if (serviceCount.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO services
       (provider_id, title, description, category, price, duration_minutes, location, image_url)
       VALUES
       ($1, 'Home Deep Cleaning', 'Professional home cleaning for kitchens, bathrooms and living spaces.', 'Cleaning', 999, 180, 'Indore', NULL),
       ($1, 'AC Service & Repair', 'AC inspection, cleaning and minor repair service by an experienced technician.', 'AC Repair', 599, 90, 'Indore', NULL),
       ($1, 'Electrician Visit', 'Electrical troubleshooting, switches, sockets, fans and basic household wiring.', 'Electrical', 399, 60, 'Indore', NULL)`,
      [providerId]
    );
  }

  console.log("Seed completed.");
  console.log("Admin: admin@example.com / Admin@123");
  console.log("Provider: provider@example.com / Provider@123");

  await pool.end();
};

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
