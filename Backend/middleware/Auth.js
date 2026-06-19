const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // get token from frontend
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    // Bearer token_here
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET);

    console.log("DECODED USER:", decoded);

    req.user = decoded;
    req.customerId = decoded.customerId;

    console.log("SET CUSTOMER ID:", req.customerId);

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};
