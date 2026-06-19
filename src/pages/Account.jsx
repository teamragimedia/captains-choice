import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { FiShoppingBag, FiTrendingUp, FiAward, FiMapPin } from "react-icons/fi";
import API from "../api";

import ProfileCard from "../components/Accounts/ProfileCard";
import Tabs from "../components/Accounts/Tabs";
import BusinessProfile from "../components/Accounts/BusinessProfile";
import Addresses from "../components/Accounts/Addresses";
import Orders from "../components/Accounts/Orders";
import RecurringOrders from "../components/Accounts/RecurringOrders";
import Billing from "../components/Accounts/Billing";
import Wishlist from "../components/Accounts/Wishlist";

import "../styles/account.css";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    orders: 0,
    spend: 0,
    savings: 0,
    addresses: 0,
  });

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");

    console.log("Account customerId:", customerId);

    if (!customerId) {
      console.error("❌ No customerId found");
      return;
    }

    // ✅ FETCH USER
    API.get("/user/me", {
      headers: {
        customerId: customerId,
      },
    })
      .then((res) => {
        console.log("USER:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("USER ERROR:", err);
      });

    // ✅ FETCH STATS (OPTIONAL)
    API.get("/user/stats", {
      headers: {
        customerId: customerId,
      },
    })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.warn("Stats not available (OK if not created)");
      });
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <BusinessProfile user={user} setUser={setUser} />;
      case "addresses":
        return <Addresses user={user} />;
      case "orders":
        return <Orders user={user} />;
      case "recurring":
        return <RecurringOrders user={user} />;
      case "billing":
        return <Billing user={user} />;
      case "wishlist":
        return <Wishlist user={user} />;
      default:
        return <BusinessProfile user={user} setUser={setUser} />;
    }
  };

  // ✅ LOADING STATE
  const customerId = localStorage.getItem("customerId");

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading your account...</h2>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* 🔥 BREADCRUMB */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb">
          <Link to="/" className="link">
            Home
          </Link>
          <span> / </span>
          <strong>Account</strong>
        </div>
      </div>

      <div className="account-container">
        {/* ✅ PROFILE */}
        <ProfileCard user={user} />

        {/* 🔥 STATS */}
        <div className="statistics">
          <div className="stat-card">
            <div className="stat-top">
              <FiShoppingBag className="stat-icon blue" />
              <span className="badge green">+12%</span>
            </div>
            <h3>{stats.orders}</h3>
            <p>Total Orders</p>
            <span className="sub-text">Last 12 months</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <FiTrendingUp className="stat-icon green" />
              <span className="badge green">+18%</span>
            </div>
            <h3>₹{stats.spend}</h3>
            <p>Total Spend</p>
            <span className="sub-text">This financial year</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <FiAward className="stat-icon orange" />
              <span className="badge gold">Gold</span>
            </div>
            <h3>₹{stats.savings}</h3>
            <p>Total Savings</p>
            <span className="sub-text">From Offers</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <FiMapPin className="stat-icon blue" />
              <span className="badge blue">Active</span>
            </div>
            <h3>{stats.addresses}</h3>
            <p>Addresses</p>
            <span className="sub-text">1 primary</span>
          </div>
        </div>

        {/* ✅ TABS */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ✅ CONTENT */}
        <div className="tab-content">{renderTab()}</div>
      </div>
    </div>
  );
};

export default Account;
