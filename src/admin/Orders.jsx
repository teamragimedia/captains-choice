import "./Admin.css";

import API from "../api";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage customer orders</p>
        </div>
      </div>

      <div className="admin-module-card">
        <table className="admin-module-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>ORD-{order.id}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <span
                      className={`module-badge ${order.status === "delivered" ? "green" : order.status === "cancelled" ? "red" : "orange"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No Orders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
