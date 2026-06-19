import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./admin.css";
import logo from "../assets/logoicon.png";
import {
  FaChevronDown,
  FaChevronRight,
  FaHome,
  FaChartBar,
  FaUsers,
  FaBoxes,
  FaClipboardList,
  FaWarehouse,
  FaUserShield,
  FaCog,
  FaShoppingCart,
} from "react-icons/fa";

import { MdCategory, MdInventory, MdOutlineAnalytics } from "react-icons/md";

import { BsCartCheck, BsReceipt } from "react-icons/bs";

import { FiTruck } from "react-icons/fi";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({
    Reports: true,
    Customer: true,
    Catalog: true,
    Orders: true,
    Inventory: true,
    Users: true,
  });

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };
  // 🔐 GET USER DATA
  const user = JSON.parse(localStorage.getItem("adminUser"));
  const token = localStorage.getItem("adminToken");

  // 🔒 PROTECT ROUTE
  if (!token) {
    window.location.href = "/admin-login";
  }

  // 🔥 MENU ITEMS
  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaHome />,
    },

    {
      name: "Purchases",
      path: "/admin/purchases",
      icon: <FaShoppingCart />,
    },

    {
      name: "Reports",
      icon: <FaChartBar />,
      children: [
        { name: "Sales", path: "/admin/reports/sales" },
        { name: "Purchase", path: "/admin/reports/purchase" },
        { name: "Transaction", path: "/admin/reports/transaction" },
        { name: "Comparison", path: "/admin/reports/comparison" },
        { name: "Profit Report", path: "/admin/reports/profit" },
        { name: "GST Report", path: "/admin/reports/gstreport" },
      ],
    },

    {
      name: "Customer",
      icon: <FaUsers />,
      children: [
        { name: "Approvals", path: "/admin/approvals" },
        { name: "Customers", path: "/admin/customers" },
      ],
    },

    {
      name: "Catalog",
      icon: <MdCategory />,
      children: [
        { name: "Categories", path: "/admin/categories" },
        { name: "Products", path: "/admin/products" },
      ],
    },

    {
      name: "Orders",
      icon: <BsCartCheck />,
      children: [
        { name: "Orders", path: "/admin/orders" },
        { name: "Invoices", path: "/admin/invoices" },
        { name: "Shipping", path: "/admin/shipping" },
      ],
    },

    {
      name: "Inventory",
      icon: <FaWarehouse />,
      children: [
        { name: "Inventory", path: "/admin/inventory" },
        { name: "Waste Management", path: "/admin/waste" },
      ],
    },

    {
      name: "Users",
      icon: <FaUserShield />,
      children: [
        { name: "Admin Users", path: "/admin/users" },
        { name: "Staff Members", path: "/admin/staff" },
      ],
    },
  ];

  // 🔥 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminUser");

    navigate("/admin-login");
  };

  // 🔥 AVATAR INITIALS
  const getInitials = (name) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className="admin-sidebar">
        {/* TOP LOGO */}
        <div className="sidebar-top">
          <img src={logo} alt="logo" />
          <div>
            <h3>Captain's Choice</h3>
            <p>Admin Panel</p>
          </div>
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">
          {menu.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    className="menu-dropdown-btn"
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="menu-left">
                      <span className="menu-icon">{item.icon}</span>

                      <span>{item.name}</span>
                    </div>

                    {openMenus[item.name] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>

                  {openMenus[item.name] && (
                    <div className="submenu">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={
                            location.pathname === sub.path
                              ? "submenu-active"
                              : ""
                          }
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <span className="menu-icon">{item.icon}</span>

                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* 🔥 DYNAMIC USER */}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">{getInitials(user?.name)}</div>
            <div>
              <h4>{user?.name || "Admin User"}</h4>
              <p>{user?.email || "admin@captains.com"}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <p className="copyright">© 2026 All Rights Reserved</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
