const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token = authHeader.split(" ")[1];

    const SECRET = process.env.JWT_ADMIN_SECRET;

    const decoded = jwt.verify(token, SECRET);

    const allowedRoles = ["admin", "manager", "superadmin"];

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (err) {
    console.error("VERIFY ADMIN ERROR:", err);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
