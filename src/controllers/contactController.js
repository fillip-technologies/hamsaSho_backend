const storageService = require("../services/storageService");


exports.createContact = async (req, res) => {
  try {
    
    const { name, email, mobile } = req.body;

    if (!name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least Name, Email, and Mobile number.",
      });
    }

    const savedRecord = await storageService.saveContact(req.body);

    res.status(201).json({
      success: true,
      message: "Contact inquiry / demo request submitted successfully.",
      data: savedRecord,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit demo request.",
    });
  }
};

// @desc    Get all contact inquiries
// @route   GET /api/contacts
// @access  Private (Admin)
exports.getContacts = async (req, res) => {
  try {
    const { status, product, search } = req.query;
    const inquiries = await storageService.getContacts({ status, product, search });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
      dbStatus: storageService.getDbStatus(),
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contact inquiries.",
    });
  }
};

// @desc    Get summary statistics
// @route   GET /api/contacts/stats
// @access  Private (Admin)
exports.getContactStats = async (req, res) => {
  try {
    const stats = await storageService.getStats();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get Contact Stats Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch statistics.",
    });
  }
};

// @desc    Update contact inquiry status or notes
// @route   PATCH /api/contacts/:id/status
// @access  Private (Admin)
exports.updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;

    const updated = await storageService.updateContact(id, { status, adminNotes });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact status updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update contact status.",
    });
  }
};

// @desc    Delete a contact inquiry
// @route   DELETE /api/contacts/:id
// @access  Private (Admin)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await storageService.deleteContact(id);

    res.status(200).json({
      success: true,
      message: "Inquiry record deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete contact record.",
    });
  }
};
