import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import API from "../api";

const Approvals = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    API.get("/admin/all-users") // 🔥 IMPORTANT CHANGE
      .then((res) => setData(res.data))
      .catch(() => console.log("Error fetching data"));
  };

  return (
    <div className="admin-card">
      <h2>Business Profile Approvals</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Owner</th>
            <th>Email</th>
            <th>Type</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((u) => (
              <tr key={u.id}>
                <td>{u.business_name}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.business_type}</td>

                {/* STATUS */}
                <td>
                  <span className={`status ${u.status}`}>{u.status}</span>
                </td>

                {/* DATE */}
                <td>
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString()
                    : "-"}
                </td>

                {/* ACTION */}
                <td>
                  <button
                    className={
                      u.status === "pending" ? "view-btn" : "details-btn"
                    }
                    onClick={() => navigate(`/admin/approvals/${u.id}`)}
                  >
                    {u.status === "pending" ? "Open Request" : "View Details"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No approval requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Approvals;
