const jwt = require("jsonwebtoken");
const storageService = require("../services/storageService");

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Please log in as an administrator.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "hamsa_soham_admin_secret_jwt_key_2026_hostinger_mysql"
    );

    const admin = await storageService.findAdminById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or session expired.",
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token verification failed or token expired. Please log in again.",
    });
  }
};

module.exports = { protectAdmin };
