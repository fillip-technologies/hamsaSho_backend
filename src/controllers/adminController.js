const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const storageService = require("../services/storageService");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "hamsa_soham_admin_secret_jwt_key_2026_cpanel_mysql",
    { expiresIn: "7d" }
  );
};

// @desc    Authenticate Admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both admin email and password.",
      });
    }

    const admin = await storageService.findAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    const token = generateToken(admin.id);

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully.",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error occurred during admin login.",
    });
  }
};

// @desc    Get Current Admin Profile
// @route   GET /api/admin/me
// @access  Private (Admin)
exports.getAdminProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching admin profile.",
    });
  }
};

// @desc    Get Database Connection & Diagnostics Status
// @route   GET /api/admin/db-status
// @access  Public
exports.getDbStatus = async (req, res) => {
  try {
    const status = storageService.getDbStatus();
    res.status(200).json({
      success: true,
      ...status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error retrieving database status.",
    });
  }
};
