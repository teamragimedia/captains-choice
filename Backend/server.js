const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const path = require("path");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

console.log("=== SERVER STARTING ===");
console.log("PORT =", process.env.PORT);
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_NAME =", process.env.DB_NAME);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PASSWORD LENGTH =", process.env.DB_PASSWORD?.length);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

const app = express();

// app.use(
//   helmet({
//     crossOriginResourcePolicy: {
//       policy: "cross-origin",
//     },
//   }),
// );

// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 200,
//     standardHeaders: true,
//     legacyHeaders: false,
//   }),
// );

// OTP / Login protection
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: {
    message: "Too many attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ================= MIDDLEWARE ================= */

// app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(
  express.json({
    limit: "10mb",
  }),
);

// Request logger (temporary for debugging)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// CUSTOMER HEADER
app.use((req, res, next) => {
  const customerId = req.headers.customerid;

  if (customerId) {
    req.customerId = customerId;
  }

  next();
});

/* ================= ROUTES IMPORT ================= */

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const addressRoutes = require("./routes/addressRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const recurringRoutes = require("./routes/recurringRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const dashboardRoutes = require("./routes/dashboard");
const wasteRoutes = require("./routes/waste");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const analyticsRoutes = require("./routes/analytics");
const reportRoutes = require("./routes/reports");
const shippingRoutes = require("./routes/shipping");
const customerRoutes = require("./routes/customers");
const staffRoutes = require("./routes/staff");
const cartRoutes = require("./routes/cartRoutes");
const purchaseReportRoutes = require("./routes/purchaseReportRoutes");
const salesReportRoutes = require("./routes/salesReportRoutes");
const transactionReportRoutes = require("./routes/transactionReportRoutes");
const comparisonReportRoutes = require("./routes/comparisonReportRoutes");
const profitReportRoutes = require("./routes/profitReportRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const gstReportRoutes = require("./routes/gstReportRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

/* ================= STATIC ================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= TEST ================= */

// app.get("/", (req, res) => {
//   res.send("🚀 Ecommerce API running");
// });

/* ================= ADMIN ================= */

app.use("/api/admin", adminRoutes);
app.use("/api/admin-auth", adminAuthRoutes);

/* ================= MAIN APIs ================= */

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recurring-orders", recurringRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchase-reports", purchaseReportRoutes);
app.use("/api/sales-reports", salesReportRoutes);
app.use("/api/transaction-reports", transactionReportRoutes);
app.use("/api/comparison-reports", comparisonReportRoutes);
app.use("/api/profit-reports", profitReportRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/gst-reports", gstReportRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/suppliers", supplierRoutes);

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

/* ================= OTP ================= */

const OTP_STORE = {};

// SEND OTP
app.post("/api/send-otp", authLimiter, (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      message: "Phone required",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  OTP_STORE[phone] = {
    otp,
    expiresAt: Date.now() + 2 * 60 * 1000,
  };

  console.log(`OTP for ${phone}: ${otp}`);

  res.json({
    message: "OTP sent",
  });
});

/* ================= VERIFY OTP ================= */

app.post("/api/verify-otp", authLimiter, async (req, res) => {
  try {
    const { phone } = req.body;

    // EXISTING USER?
    const [result] = await db.query(
      `
SELECT *
FROM customers
WHERE phone=?
`,
      [phone],
    );

    // USER EXISTS
    if (result.length > 0) {
      const user = result[0];

      const token = jwt.sign(
        {
          customerId: user.id,
        },
        process.env.JWT_CUSTOMER_SECRET,
        {
          expiresIn: "7d",
        },
      );

      return res.json({
        token,

        customerId: user.id,

        isNewUser: !user.is_profile_submitted,

        message: "Login success",
      });
    }

    // CREATE USER
    const [insertResult] = await db.query(
      `
INSERT INTO customers
(phone)
VALUES (?)
`,
      [phone],
    );

    const token = jwt.sign(
      {
        customerId: insertResult.insertId,
      },
      process.env.JWT_CUSTOMER_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.json({
      token,

      customerId: insertResult.insertId,

      isNewUser: true,

      message: "New user created",
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= REACT BUILD ================= */

/* ================= START ================= */

(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("DATABASE CONNECTED");
  } catch (err) {
    console.error("DATABASE ERROR:", err);
  }
})();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
