const storageService = require("../services/storageService");

// @route   GET /api/testimonials  (public)
exports.getTestimonials = async (req, res) => {
  try {
    const activeOnly = req.query.active === "true" || !req.headers.authorization;
    const testimonials = await storageService.getTestimonials({ activeOnly });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/testimonials  (admin)
exports.createTestimonial = async (req, res) => {
  try {
    const { name, hospital, quote } = req.body;
    if (!name || !hospital || !quote) {
      return res.status(400).json({ success: false, message: "Name, hospital, and quote are required." });
    }
    const record = await storageService.createTestimonial(req.body);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/testimonials/:id  (admin)
exports.updateTestimonial = async (req, res) => {
  try {
    const updated = await storageService.updateTestimonial(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Testimonial not found." });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/testimonials/:id  (admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    await storageService.deleteTestimonial(req.params.id);
    res.status(200).json({ success: true, message: "Testimonial deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
