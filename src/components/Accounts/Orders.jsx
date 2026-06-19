import React, { useEffect, useState } from "react";
import API from "../../api";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/api/orders/my")
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setOrders([]));
  }, []);

  {
    orders.length === 0 ? (
      <p>No orders found</p>
    ) : (
      orders.map((o) => (
        <div key={o._id} className="order-row">
          <span>{o.orderId}</span>
          <span>{o.total}</span>
          <span>{o.status}</span>
        </div>
      ))
    );
  }

  return (
    <div className="card">
      <h3>My Orders</h3>

      {orders.map((o) => (
        <div key={o._id} className="order-row">
          <span>{o.orderId}</span>
          <span>{o.total}</span>
          <span>{o.status}</span>
        </div>
      ))}
    </div>
  );
};

export default Orders;
