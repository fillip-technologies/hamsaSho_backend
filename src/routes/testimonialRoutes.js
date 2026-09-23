const express = require("express");
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require("../controllers/testimonialController");
const { protectAdmin } = require("../middleware/auth");

router.get("/", getTestimonials);                          // public
router.post("/", protectAdmin, createTestimonial);         // admin
router.put("/:id", protectAdmin, updateTestimonial);       // admin
router.delete("/:id", protectAdmin, deleteTestimonial);    // admin

module.exports = router;
