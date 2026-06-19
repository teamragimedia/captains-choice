import "./Admin.css";

import { useEffect, useState } from "react";
import API from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");

      setCustomers(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-module-page">
      {/* HEADER */}

      <div className="admin-module-header">
        <div>
          <h1>Customers</h1>

          <p>Manage customer accounts and business profiles</p>
        </div>
      </div>

      {/* STATS */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>TOTAL CUSTOMERS</span>

          <h2>{customers.length}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>APPROVED</span>

          <h2>{customers.filter((c) => c.is_profile_approved === 1).length}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>PENDING</span>

          <h2>{customers.filter((c) => c.is_profile_approved === 0).length}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>RESTAURANTS</span>

          <h2>
            {
              customers.filter(
                (c) => c.business_type?.toLowerCase() === "restaurant",
              ).length
            }
          </h2>
        </div>
      </div>

      {/* TABLE */}

      <div className="admin-module-card">
        <div className="filter-row">
          <input type="text" placeholder="Search customer..." />

          <select>
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
          </select>

          <button className="primary-btn">Export</button>
        </div>

        <table className="admin-module-table">
          <thead>
            <tr>
              <th>Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Business</th>

              <th>Business Type</th>

              <th>Monthly Volume</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading customers...</td>
              </tr>
            ) : customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id}>
                  {/* NAME */}

                  <td>
                    <div className="staff-user">
                      <div className="staff-avatar">
                        {customer.name?.charAt(0)}
                      </div>

                      <div>
                        <strong>{customer.name}</strong>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}

                  <td>{customer.email}</td>

                  {/* PHONE */}

                  <td>{customer.phone}</td>

                  {/* BUSINESS */}

                  <td>{customer.business_name}</td>

                  {/* BUSINESS TYPE */}

                  <td>
                    <span className="role-badge">{customer.business_type}</span>
                  </td>

                  {/* MONTHLY VOLUME */}

                  <td>
                    ₹{Number(customer.monthly_volume || 0).toLocaleString()}
                  </td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`module-badge ${
                        customer.is_profile_approved === 1 ? "green" : "orange"
                      }`}
                    >
                      {customer.is_profile_approved === 1
                        ? "Approved"
                        : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
