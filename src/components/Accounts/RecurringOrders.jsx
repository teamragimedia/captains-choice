import React, { useEffect, useState } from "react";
import API from "../../api";

const RecurringOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    productName: "",
    frequency: "Weekly",
    quantity: "",
  });

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = () => {
    API.get("/api/recurring/my").then((res) => {
      setOrders(Array.isArray(res.data) ? res.data : []);
    });
  };

  const handleCreate = () => {
    API.post("/api/recurring/create", form).then(() => {
      setShowForm(false);
      setForm({ productName: "", frequency: "Weekly", quantity: "" });
      fetchRecurring();
    });
  };

  const handleDelete = (id) => {
    API.delete(`/api/recurring/${id}`).then(fetchRecurring);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recurring Orders</h3>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          + Create Recurring Order
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="recurring-form">
          <input
            placeholder="Product Name"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
          />

          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
          >
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>

          <input
            placeholder="Quantity (kg)"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <button onClick={handleCreate}>Create</button>
        </div>
      )}

      {/* LIST */}
      {orders.length === 0 ? (
        <p>No recurring orders found</p>
      ) : (
        orders.map((o) => (
          <div className="recurring-card" key={o._id}>
            <div>
              <h4>{o.productName}</h4>
              <p>Frequency: {o.frequency}</p>
              <p>Quantity: {o.quantity} kg</p>
              <p>Next Delivery: {o.nextDelivery}</p>
            </div>

            <div className="recurring-actions">
              <span className={`status ${o.status}`}>{o.status}</span>
              <button onClick={() => handleDelete(o._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecurringOrders;
