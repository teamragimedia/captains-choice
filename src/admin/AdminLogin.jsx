import React, { useState } from "react";

import "./Admin.css";
import API from "../api";
import logo from "../assets/Captain’s Choice Logo.png";

const AdminLogin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    API.post("/admin-auth/login", form)
      .then((res) => {
        // 🔥 CLEAR OLD DATA (important when switching users)
        localStorage.clear();

        // ✅ STORE EVERYTHING
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminRole", res.data.user.role);
        localStorage.setItem("adminUser", JSON.stringify(res.data.user));

        console.log("Logged User:", res.data.user); // 🔍 debug

        alert("Login successful");

        window.location.href = "/admin";
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Login failed");
      });
  };

  return (
    <div className="admin-login">
      <div className="login-wrapper">
        <img src={logo} alt="Logo" className="adminlogo" />
        <p className="sub-text">Admin Portal</p>

        <div className="login-card">
          <h3>Login</h3>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button onClick={handleLogin}>Login</button>
        </div>

        <p className="footer">© 2026 Captain's Choice. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
