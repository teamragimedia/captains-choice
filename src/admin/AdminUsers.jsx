import React, { useEffect, useState } from "react";
import "./AdminUsers.css";
import API from "../api";

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [editId, setEditId] = useState(null);
  const [tempRole, setTempRole] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    status: "active",
  });

  const currentRole = localStorage.getItem("adminRole");
  const currentUserId = localStorage.getItem("adminId");

  const ADMIN_API = "/admin/admins";

  /* ================= FETCH ================= */

  const fetchAdmins = async () => {
    try {
      const res = await API.get(ADMIN_API);
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= FILTER ================= */

  const adminAccounts = admins.filter(
    (u) => u.role === "admin" || u.role === "superadmin",
  );

  const managers = admins.filter((u) => u.role === "manager");

  /* ================= ADD ================= */

  const handleAdd = async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        alert("Fill all fields");
        return;
      }

      await API.post(ADMIN_API, form);

      fetchAdmins();

      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "admin",
        status: "active",
      });
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };

  /* ================= RESET ================= */

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      status: "active",
    });
  };

  /* ================= ROLE UPDATE ================= */

  const updateRole = async (id) => {
    try {
      await API.put(`${ADMIN_API}/${id}`, {
        role: tempRole,
      });

      fetchAdmins();
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= STATUS TOGGLE ================= */

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await API.put(`${ADMIN_API}/${id}`, {
        status: newStatus,
      });

      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteAdmin = async (id) => {
    try {
      if (!window.confirm("Delete user?")) return;

      await API.delete(`${ADMIN_API}/${id}`);

      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h2>Users & Admin Management</h2>
        <p>Manage all users and admin accounts</p>
      </div>

      <div className="card">
        <h3>Add New User / Admin</h3>

        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>

        <div className="action-row">
          <button className="primary-btn" onClick={handleAdd}>
            + Add User/Admin
          </button>

          <button className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Admin Accounts</h3>
          <span className="badge">{adminAccounts.length}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {adminAccounts.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.phone}</td>

                <td>
                  {editId === admin.id ? (
                    <>
                      <select
                        value={tempRole}
                        onChange={(e) => setTempRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="superadmin">Super Admin</option>
                      </select>

                      <button onClick={() => updateRole(admin.id)}>Save</button>
                    </>
                  ) : (
                    <span className="role-badge">{admin.role}</span>
                  )}
                </td>

                <td>
                  <span className={`status ${admin.status?.toLowerCase()}`}>
                    {admin.status}
                  </span>
                </td>

                <td>
                  {currentRole === "superadmin" && (
                    <>
                      <button
                        onClick={() => {
                          setEditId(admin.id);
                          setTempRole(admin.role);
                        }}
                      >
                        Edit Role
                      </button>

                      <button
                        className="status-btn"
                        onClick={() => toggleStatus(admin.id, admin.status)}
                      >
                        {admin.status?.toLowerCase() === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      {admin.id != currentUserId && (
                        <button onClick={() => deleteAdmin(admin.id)}>
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Managers</h3>
          <span className="badge">{managers.length}</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {managers.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>

                <td>
                  <span className={`status ${m.status}`}>{m.status}</span>
                </td>

                <td>
                  {currentRole === "superadmin" && (
                    <>
                      <button
                        className="status-btn"
                        onClick={() => toggleStatus(m.id, m.status)}
                      >
                        {m.status?.toLowerCase() === "active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button onClick={() => deleteAdmin(m.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
