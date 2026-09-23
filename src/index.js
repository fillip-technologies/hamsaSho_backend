const path = require("path");
const dotenv = require("dotenv");

// Load env vars FIRST before anything else
dotenv.config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { initDB } = require("./config/db");

// Trigger DB initialization
initDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", // allow all origins for dev and cPanel deployment
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get("/api/health", (req, res) => {
  const { getDbStatus } = require("./config/db");
  res.json({
    status: "ok",
    database: "cPanel MySQL / MariaDB (Zero-Loss Dual-Mode)",
    dbStatus: getDbStatus(),
    message: "Hamsa Soham Admin & Inquiries API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
