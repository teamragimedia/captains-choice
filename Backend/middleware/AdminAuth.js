const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin login required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_ADMIN_SECRET) {
      console.error("JWT_ADMIN_SECRET is missing from .env");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    const allowedRoles = ["admin", "manager", "superadmin"];

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    if (
      error.name !== "JsonWebTokenError" &&
      error.name !== "TokenExpiredError" &&
      error.name !== "NotBeforeError"
    ) {
      console.error("Admin authentication error:", error);
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};
