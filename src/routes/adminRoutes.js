const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  getDbStatus,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/auth");

// Admin Login Only
router.post("/login", adminLogin);
router.get("/me", protectAdmin, getAdminProfile);
router.get("/db-status", getDbStatus);

module.exports = router;
