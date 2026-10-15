const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const secret = process.env.JWT_CUSTOMER_SECRET;

    if (!secret) {
      console.error("JWT customer secret is not configured.");
      return res.status(500).json({
        message: "Authentication configuration error",
      });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (
      !decoded.customerId ||
      !Number.isInteger(Number(decoded.customerId)) ||
      Number(decoded.customerId) <= 0
    ) {
      return res.status(401).json({
        message: "Invalid customer token",
      });
    }

    req.user = decoded;
    req.customerId = Number(decoded.customerId);

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
