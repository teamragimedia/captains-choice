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

    console.log("TOKEN:", token);
    console.log("JWT SECRET:", process.env.JWT_CUSTOMER_SECRET);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET);

    console.log("DECODED USER:", decoded);

    req.user = decoded;
    req.customerId = decoded.customerId;

    console.log("SET CUSTOMER ID:", req.customerId);

    next();
  } catch (err) {
    console.log("JWT ERROR:", err);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
