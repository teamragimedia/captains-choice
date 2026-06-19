import "../../admin/Admin.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

import { Package, Users, UserCog, IndianRupee } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalStaff: 0,
    totalRevenue: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    premiumUsers: 0,
    todayRevenue: 0,
    wasteOutToday: 0,
    lowStockProducts: [],
    recentOrders: [],
    recentUsers: [],
    staffMembers: [],
  });

  const [summary, setSummary] = useState({
    totalSales: 0,
    totalPurchases: 0,
    totalProfit: 0,
    totalPaymentIn: 0,
    totalPaymentOut: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");

      setDashboard({
        totalProducts: res.data.totalProducts || 0,
        totalUsers: res.data.totalUsers || 0,
        totalStaff: res.data.totalStaff || 0,
        totalRevenue: res.data.totalRevenue || 0,
        activeUsers: res.data.activeUsers || 0,
        inactiveUsers: res.data.inactiveUsers || 0,
        premiumUsers: res.data.premiumUsers || 0,
        todayRevenue: res.data.todayRevenue || 0,

        wasteOutToday: res.data.wasteOutToday || 0,

        lowStockProducts: res.data.lowStockProducts || [],
        recentOrders: res.data.recentOrders || [],
        recentUsers: res.data.recentUsers || [],
        staffMembers: res.data.staffMembers || [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await API.get("/reports/business-summary");

      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const total =
    dashboard.activeUsers + dashboard.inactiveUsers + dashboard.premiumUsers;

  const activePercent = (dashboard.activeUsers / total) * 100 || 0;

  const inactivePercent = (dashboard.inactiveUsers / total) * 100 || 0;

  return (
    <div className="dashboard-page">
      {/* HEADER */}

      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>Overview of your business metrics and analytics</p>
      </div>

      {/* TOP CARDS */}

      <div className="top-cards">
        <div className="dashboard-card">
          <div>
            <span>TOTAL PRODUCTS</span>

            <h2>{dashboard.totalProducts}</h2>
          </div>

          <div className="icon-box brown">
            <Package size={20} />
          </div>
        </div>

        <div className="dashboard-card">
          <div>
            <span>TOTAL USERS</span>

            <h2>{dashboard.totalUsers}</h2>
          </div>

          <div className="icon-box blue">
            <Users size={20} />
          </div>
        </div>

        <div className="dashboard-card">
          <div>
            <span>TOTAL STAFF</span>

            <h2>{dashboard.totalStaff}</h2>
          </div>

          <div className="icon-box sky">
            <UserCog size={20} />
          </div>
        </div>

        <div className="dashboard-card">
          <div>
            <span>REVENUE (₹)</span>

            <h2>₹{Number(dashboard.totalRevenue).toLocaleString()}</h2>
          </div>

          <div className="icon-box yellow">
            <IndianRupee size={20} />
          </div>
        </div>

        <div className="dashboard-card">
          <div>
            <span>TODAY REVENUE</span>

            <h2>₹{Number(dashboard.todayRevenue).toLocaleString()}</h2>
          </div>

          <div className="icon-box green-card">💰</div>
        </div>

        <div className="dashboard-card">
          <div>
            <span>WASTE OUT TODAY</span>

            <h2>{dashboard.wasteOutToday} KG</h2>
          </div>

          <div className="icon-box red-card">♻️</div>
        </div>
      </div>

      {/* Mini Grid */}
      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>Total Sales</span>

          <h2>₹{Number(summary.totalSales).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Purchases</span>

          <h2>₹{Number(summary.totalPurchases).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Profit</span>

          <h2
            style={{
              color: summary.totalProfit >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            ₹{Number(summary.totalProfit).toLocaleString()}
          </h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Payment In</span>

          <h2>₹{Number(summary.totalPaymentIn).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Payment Out</span>

          <h2>₹{Number(summary.totalPaymentOut).toLocaleString()}</h2>
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="main-grid">
        {/* USER ANALYTICS */}

        <div className="analytics-card">
          <h3>User Analytics</h3>

          <div className="analytics-content">
            {/* DONUT */}

            <div className="donut-wrapper">
              <div
                className="donut-chart"
                style={{
                  background: `conic-gradient(
                    #0f3fb8 0% ${activePercent}%,
                    #ececec ${activePercent}% ${
                      activePercent + inactivePercent
                    }%,
                    #1bc47d ${activePercent + inactivePercent}% 100%
                  )`,
                }}
              >
                <div className="donut-inner"></div>
              </div>

              <div className="chart-labels">
                <div>
                  <span className="dot active"></span>
                  Active Users
                </div>

                <div>
                  <span className="dot inactive"></span>
                  Inactive Users
                </div>

                <div>
                  <span className="dot premium"></span>
                  Premium Users
                </div>
              </div>
            </div>

            {/* STATS */}

            <div className="analytics-stats">
              <div className="stat-box">
                <div className="left">
                  <span className="dot active"></span>
                  Active Users
                </div>

                <h4>{dashboard.activeUsers}</h4>
              </div>

              <div className="stat-box">
                <div className="left">
                  <span className="dot inactive"></span>
                  Inactive Users
                </div>

                <h4>{dashboard.inactiveUsers}</h4>
              </div>

              <div className="stat-box">
                <div className="left">
                  <span className="dot premium"></span>
                  Premium Users
                </div>

                <h4 className="green">{dashboard.premiumUsers}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* LOW STOCK */}

        <div className="stock-card">
          <div className="stock-top">
            <h3>Low Stock - Critical</h3>

            <div className="items-badge">
              {dashboard.lowStockProducts.length} Items
            </div>
          </div>

          <div className="stock-list">
            {dashboard.lowStockProducts.length > 0 ? (
              dashboard.lowStockProducts.map((item, index) => (
                <div className="stock-item" key={index}>
                  <div>
                    <div className="critical-badge">Critical</div>

                    <h4>{item.name}</h4>

                    <p>Category: {item.category}</p>
                  </div>

                  <div className="stock-right">
                    <span>Stock</span>

                    <h2>{item.stock}</h2>
                  </div>
                </div>
              ))
            ) : (
              <div className="stock-item">
                <div>
                  <div className="critical-badge">No Low Stock</div>

                  <h4>All products are stocked</h4>
                </div>
              </div>
            )}
          </div>

          <button
            className="restock-btn"
            onClick={() => navigate("/admin/products")}
          >
            Restock Now →
          </button>
        </div>
      </div>

      {/* RECENT ORDERS */}

      <div className="recent-orders-card">
        <div className="recent-header">
          <h3>Recent Orders</h3>

          <button
            className="view-all-btn"
            onClick={() => navigate("/admin/orders")}
          >
            View All
          </button>
        </div>

        {/* ORDER STATS */}

        <div className="order-stats">
          <div className="order-stat-box">
            <span>TOTAL ORDERS</span>

            <h2>{dashboard.recentOrders?.length || 0}</h2>
          </div>

          <div className="order-stat-box">
            <span>PENDING</span>

            <h2 className="orange">
              {dashboard.recentOrders?.filter((o) => o.status === "pending")
                .length || 0}
            </h2>
          </div>

          <div className="order-stat-box">
            <span>PROCESSING</span>

            <h2 className="blue-text">
              {dashboard.recentOrders?.filter((o) => o.status === "processing")
                .length || 0}
            </h2>
          </div>

          <div className="order-stat-box">
            <span>DELIVERED</span>

            <h2 className="green-text">
              {dashboard.recentOrders?.filter((o) => o.status === "delivered")
                .length || 0}
            </h2>
          </div>
        </div>

        {/* TABLE */}

        <table className="recent-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.recentOrders.length > 0 ? (
              dashboard.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>ORD-{order.id}</td>

                  <td>₹{Number(order.total_price).toFixed(2)}</td>

                  <td>
                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>0</td>

                <td>₹0</td>

                <td>
                  <span className="order-status pending">No Orders</span>
                </td>

                <td>0</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RECENT USERS */}

      <div className="recent-users-card">
        <div className="recent-users-header">
          <h3>Recent Users</h3>
        </div>

        <table className="recent-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Orders</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.recentUsers.length > 0 ? (
              dashboard.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{new Date(user.created_at).toLocaleDateString()}</td>

                  {/* ORDERS */}

                  <td>
                    <span className="orders-badge">{user.orders || 0}</span>
                  </td>

                  {/* STATUS */}

                  <td>
                    <span className={`user-status ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>

                <td>
                  <span className="orders-badge">0</span>
                </td>

                <td>
                  <span className="user-status inactive">No Users</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* STAFF MEMBERS */}

      <div className="staff-card">
        <div className="staff-header">
          <h3>Staff Members</h3>
        </div>

        <table className="staff-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dashboard.staffMembers.length > 0 ? (
              dashboard.staffMembers.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name}</td>

                  <td className="staff-role">{staff.role}</td>

                  <td>{staff.email}</td>

                  <td>{new Date(staff.created_at).toLocaleDateString()}</td>

                  <td>
                    <span className={`user-status ${staff.status}`}>
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>

                <td>
                  <span className="user-status inactive">No Staff</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
