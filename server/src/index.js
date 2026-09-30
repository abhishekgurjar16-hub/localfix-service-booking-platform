import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { testDatabaseConnection } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
  })
);

app.use(express.json());

// -------------------------
// Health / Home
// -------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Servora API is running."
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    message: "Servora API is running."
  });
});

// -------------------------
// API Routes
// -------------------------

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// -------------------------
// Error Handling
// -------------------------

app.use(notFound);
app.use(errorHandler);

// -------------------------
// Start Server
// -------------------------

const startServer = async () => {
  try {
    await testDatabaseConnection();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servora API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();