import "./Admin.css";

import API from "../api";
import { useEffect, useState } from "react";

export default function WasteManagement() {
  const [waste, setWaste] = useState([]);

  useEffect(() => {
    fetchWaste();
  }, []);

  const fetchWaste = async () => {
    const res = await API.get("/waste/history");
    setWaste(res.data || []);
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Waste Management</h1>
          <p>Track damaged and expired stock</p>
        </div>
      </div>

      <div className="admin-module-card">
        <table className="admin-module-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Cost Price</th>
              <th>Waste Amount</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {waste.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>₹{Number(item.cost_price).toLocaleString()}</td>

                <td
                  style={{
                    color: "#dc2626",
                    fontWeight: "600",
                  }}
                >
                  ₹{Number(item.waste_amount).toLocaleString()}
                </td>

                <td>{item.reason}</td>

                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
