import "./Admin.css";

import API from "../api";
import { useEffect, useState } from "react";

export default function StaffMembers() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get("/staff");

      setStaff(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // STATS

  const totalStaff = staff.length;

  const activeStaff = staff.filter((s) => s.status === "active").length;

  const inactiveStaff = staff.filter((s) => s.status === "inactive").length;

  const managers = staff.filter(
    (s) => s.role?.toLowerCase() === "manager",
  ).length;

  return (
    <div className="admin-module-page">
      {/* HEADER */}

      <div className="admin-module-header">
        <div>
          <h1>Staff Members</h1>

          <p>Manage warehouse and operations staff</p>
        </div>

        <button className="primary-btn">+ Add Staff</button>
      </div>

      {/* STATS */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>TOTAL STAFF</span>

          <h2>{totalStaff}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>ACTIVE STAFF</span>

          <h2>{activeStaff}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>INACTIVE STAFF</span>

          <h2>{inactiveStaff}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>MANAGERS</span>

          <h2>{managers}</h2>
        </div>
      </div>

      {/* STAFF TABLE */}

      <div className="admin-module-card">
        {/* FILTERS */}

        <div className="filter-row">
          <input type="text" placeholder="Search staff..." />

          <select>
            <option>All Roles</option>
            <option>Manager</option>
            <option>Warehouse</option>
            <option>Support</option>
          </select>

          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button className="primary-btn">Export</button>
        </div>

        {/* TABLE */}

        <table className="admin-module-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Role</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Status</th>

              <th>Join Date</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading staff members...</td>
              </tr>
            ) : staff.length > 0 ? (
              staff.map((member) => (
                <tr key={member.id}>
                  {/* NAME */}

                  <td>
                    <div className="staff-user">
                      <div className="staff-avatar">
                        {member.name?.charAt(0)}
                      </div>

                      <div>
                        <strong>{member.name}</strong>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}

                  <td>
                    <span className="role-badge">{member.role}</span>
                  </td>

                  {/* EMAIL */}

                  <td>{member.email}</td>

                  {/* PHONE */}

                  <td>{member.phone || "N/A"}</td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`module-badge ${
                        member.status === "active" ? "green" : "red"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>

                  {/* JOIN DATE */}

                  <td>{new Date(member.created_at).toLocaleDateString()}</td>

                  {/* ACTIONS */}

                  <td>
                    <div className="table-actions">
                      <button className="edit-btn">Edit</button>

                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No staff members found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
