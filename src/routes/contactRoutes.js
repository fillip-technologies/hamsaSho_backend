const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactStats,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");
const { protectAdmin } = require("../middleware/auth");

// Public route to submit inquiry
router.post("/", createContact);

// Admin-only routes
router.get("/", protectAdmin, getContacts);
router.get("/stats", protectAdmin, getContactStats);
router.patch("/:id/status", protectAdmin, updateContactStatus);
router.delete("/:id", protectAdmin, deleteContact);

module.exports = router;
