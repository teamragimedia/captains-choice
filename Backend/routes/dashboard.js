const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    // TOTAL PRODUCTS
    const [products] = await db.query(`
      SELECT COUNT(*) AS totalProducts
      FROM products
    `);

    // TOTAL USERS
    const [users] = await db.query(`
      SELECT COUNT(*) AS totalUsers
      FROM users
    `);

    // TOTAL STAFF
    const [staff] = await db.query(`
      SELECT COUNT(*) AS totalStaff
      FROM users
      WHERE role != 'admin'
    `);

    // TOTAL REVENUE
    const [revenue] = await db.query(`
  SELECT COALESCE(SUM(total_price),0) revenue
  FROM orders
  WHERE payment_status = 'paid'
  AND status != 'cancelled'
`);
    console.log(revenue);
    // ACTIVE USERS
    const [activeUsers] = await db.query(`
      SELECT COUNT(*) AS activeUsers
      FROM users
      WHERE status='active'
    `);

    // INACTIVE USERS
    const [inactiveUsers] = await db.query(`
      SELECT COUNT(*) AS inactiveUsers
      FROM users
      WHERE status='inactive'
    `);

    // PREMIUM USERS
    const [premiumUsers] = await db.query(`
      SELECT COUNT(*) AS premiumUsers
      FROM customers
      WHERE is_profile_approved = 1
    `);

    // LOW STOCK PRODUCTS
    const [lowStockProducts] = await db.query(`
      SELECT
        name,
        category,
        stock
      FROM products
      WHERE stock <= 10
      ORDER BY stock ASC
      LIMIT 5
    `);

    // RECENT ORDERS
    const [recentOrders] = await db.query(`
      SELECT
        id,
        total_price,
        status,
        created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);
    // RECENT USERS WITH ORDER COUNT
    const [recentUsers] = await db.query(`
  SELECT
    u.id,
    u.name,
    u.email,
    u.phone,
    u.created_at,
    u.status,

    COUNT(o.id) AS orders

  FROM users u

  LEFT JOIN orders o
    ON o.user_id = u.id

  GROUP BY u.id

  ORDER BY u.created_at DESC

  LIMIT 5
`);

    // STAFF MEMBERS
    const [staffMembers] = await db.query(`
  SELECT
    id,
    name,
    email,
    role,
    status,
    created_at

  FROM users

  WHERE role NOT IN ('admin', 'superadmin')

  ORDER BY created_at DESC

  LIMIT 10
`);

    // TODAY REVENUE
    const [todayRevenue] = await db.query(`
  SELECT IFNULL(SUM(total_price),0) AS todayRevenue
  FROM orders
  WHERE DATE(created_at) = CURDATE()
  AND payment_status='paid'
`);

    // WASTE OUT TODAY
    // inventory table type='OUT'
    const [wasteOutToday] = await db.query(`
  SELECT IFNULL(SUM(quantity),0) AS wasteOutToday
  FROM inventory
  WHERE type='OUT'
  AND DATE(created_at)=CURDATE()
`);

    res.json({
      totalProducts: products[0]?.totalProducts || 0,

      totalUsers: users[0]?.totalUsers || 0,

      totalStaff: staff[0]?.totalStaff || 0,

      totalRevenue: revenue[0]?.revenue || 0,

      activeUsers: activeUsers[0]?.activeUsers || 0,

      inactiveUsers: inactiveUsers[0]?.inactiveUsers || 0,

      premiumUsers: premiumUsers[0]?.premiumUsers || 0,

      todayRevenue: todayRevenue[0]?.todayRevenue || 0,

      wasteOutToday: wasteOutToday[0]?.wasteOutToday || 0,

      lowStockProducts: lowStockProducts || [],

      recentOrders: recentOrders || [],

      recentUsers: recentUsers || [],

      staffMembers: staffMembers || [],
    });
  } catch (error) {
    console.log("DASHBOARD ERROR:", error);

    res.status(500).json({
      totalProducts: 0,
      totalUsers: 0,
      totalStaff: 0,
      totalRevenue: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      premiumUsers: 0,
      lowStockProducts: [],
      recentOrders: [],
    });
  }
});

module.exports = router;
