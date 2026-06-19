import { useEffect, useState } from "react";
import API from "../api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    type: "IN",
    reason: "",
    notes: "",
  });

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");

      setInventory(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");

      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveInventory = async () => {
    try {
      if (!form.product_id || !form.quantity) {
        alert("Please fill required fields");
        return;
      }

      await API.post("/inventory", {
        product_id: form.product_id,
        quantity: Number(form.quantity),
        type: form.type,
        reason: form.reason,
        notes: form.notes,
      });

      alert("Inventory updated successfully");

      setForm({
        product_id: "",
        quantity: "",
        type: "IN",
        reason: "",
        notes: "",
      });

      fetchInventory();
    } catch (error) {
      console.log(error);
      alert("Failed to update inventory");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="text-black">Inventory</h1>
        <p>Manage stock movement</p>
      </div>

      {/* Inventory Entry Form */}
      <div className="admin-card mb-6">
        <h3 className="mb-4">Stock Movement</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "15px",
          }}
        >
          <select
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
          />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="IN">Stock IN</option>
            <option value="OUT">Stock OUT</option>
          </select>

          <select name="reason" value={form.reason} onChange={handleChange}>
            <option value="">Select Reason</option>
            <option value="Purchase">Purchase</option>
            <option value="Sale">Sale</option>
            <option value="Damage">Damage</option>
            <option value="Expired">Expired</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Return">Return</option>
          </select>
        </div>

        <div style={{ marginTop: "15px" }}>
          <textarea
            name="notes"
            placeholder="Notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        <button
          className="primary-btn"
          style={{ marginTop: "15px" }}
          onClick={saveInventory}
        >
          Save Movement
        </button>
      </div>

      {/* Inventory History */}
      <div className="admin-card">
        <h3 className="mb-4">Inventory History</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td colSpan="6">No inventory records found</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.product}</td>

                  <td>{item.quantity}</td>

                  <td>
                    <span
                      className={
                        item.type === "IN" ? "status-success" : "status-danger"
                      }
                    >
                      {item.type}
                    </span>
                  </td>

                  <td>{item.reason}</td>

                  <td>{item.notes}</td>

                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
