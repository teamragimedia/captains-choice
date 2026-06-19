import "./Admin.css";

import API from "../api";
import { useEffect, useState } from "react";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");

      setWishlist(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // TOTALS

  const totalWishlist = wishlist.length;

  const inStock = wishlist.filter(
    (item) => item.stock_status === "In Stock",
  ).length;

  const outStock = wishlist.filter(
    (item) => item.stock_status === "Out of Stock",
  ).length;

  return (
    <div className="admin-module-page">
      {/* HEADER */}

      <div className="admin-module-header">
        <div>
          <h1>Wishlist</h1>

          <p>Track customer wishlist products</p>
        </div>
      </div>

      {/* STATS */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>TOTAL WISHLIST</span>

          <h2>{totalWishlist}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>IN STOCK</span>

          <h2>{inStock}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>OUT OF STOCK</span>

          <h2>{outStock}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>MOST WISHLISTED</span>

          <h2>{wishlist[0]?.product_name || "0"}</h2>
        </div>
      </div>

      {/* TABLE */}

      <div className="admin-module-card">
        <div className="filter-row">
          <input type="text" placeholder="Search product..." />

          <select>
            <option>All Status</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>

          <button className="primary-btn">Export</button>
        </div>

        <table className="admin-module-table">
          <thead>
            <tr>
              <th>Product</th>

              <th>Customer</th>

              <th>Price</th>

              <th>Stock Status</th>

              <th>Added Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading wishlist...</td>
              </tr>
            ) : wishlist.length > 0 ? (
              wishlist.map((item) => (
                <tr key={item.id}>
                  <td>{item.product_name}</td>

                  <td>{item.customer_name || "N/A"}</td>

                  <td>₹{Number(item.price).toLocaleString()}</td>

                  <td>
                    <span
                      className={`module-badge ${
                        item.stock_status === "In Stock" ? "green" : "red"
                      }`}
                    >
                      {item.stock_status}
                    </span>
                  </td>

                  <td>{new Date(item.added_date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No wishlist products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
