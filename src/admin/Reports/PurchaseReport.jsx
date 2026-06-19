import "../../admin/Admin.css";
import { useEffect, useState } from "react";
import API from "../../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PurchaseReport() {
  const [summary, setSummary] = useState({
    totalPurchaseAmount: 0,
    totalPurchaseOrders: 0,
    totalSuppliers: 0,
    totalProducts: 0,
  });

  const loadTrend = async (selectedFilter) => {
    try {
      setFilter(selectedFilter);

      const res = await API.get(
        `/purchase-reports/trend?filter=${selectedFilter}`,
      );

      setTrendData(
        res.data.map((item) => ({
          ...item,
          label: new Date(item.label).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const applyCustomFilter = async () => {
    try {
      const res = await API.get(
        `/purchase-reports/trend?from=${fromDate}&to=${toDate}`,
      );

      setTrendData(
        res.data.map((item) => ({
          ...item,
          label: new Date(item.label).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        })),
      );
    } catch (err) {
      console.log(err);
    }
  };

  const [trendData, setTrendData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [productData, setProductData] = useState([]);

  const [filter, setFilter] = useState("monthly");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchPurchaseReport();
  }, []);

  const fetchPurchaseReport = async () => {
    try {
      const [summaryRes, trendRes, supplierRes, productRes] = await Promise.all(
        [
          API.get("/purchase-reports/summary"),
          API.get("/purchase-reports/trend"),
          API.get("/purchase-reports/supplier-wise"),
          API.get("/purchase-reports/product-wise"),
        ],
      );

      setSummary(summaryRes.data);

      setTrendData(
        trendRes.data.map((item) => ({
          ...item,
          day: new Date(item.day).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        })),
      );

      setSupplierData(supplierRes.data);
      setProductData(productRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Purchase Report</h1>
          <p>Purchase analytics and supplier performance</p>
        </div>
      </div>

      {/* Monthly cards */}
      <div className="purchase-filter-card">
        <div className="purchase-filter-left">
          <button
            className={`filter-btn ${filter === "daily" ? "active" : ""}`}
            onClick={() => loadTrend("daily")}
          >
            Daily
          </button>

          <button
            className={`filter-btn ${filter === "monthly" ? "active" : ""}`}
            onClick={() => loadTrend("monthly")}
          >
            Monthly
          </button>

          <button
            className={`filter-btn ${filter === "yearly" ? "active" : ""}`}
            onClick={() => loadTrend("yearly")}
          >
            Yearly
          </button>
        </div>

        <div className="purchase-filter-right">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="date-input"
          />

          <span className="date-separator">to</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="date-input"
          />

          <button className="apply-btn" onClick={applyCustomFilter}>
            Apply
          </button>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>Total Purchase Amount</span>
          <h2>₹{Number(summary.totalPurchaseAmount).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Purchase Orders</span>
          <h2>{summary.totalPurchaseOrders}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Suppliers</span>
          <h2>{summary.totalSuppliers}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Products Purchased</span>
          <h2>{summary.totalProducts}</h2>
        </div>
      </div>

      {/* Purchase Trend */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Purchase Trend</h3>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />

              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Purchase",
                ]}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Supplier Wise */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Supplier-wise Purchase</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Total Purchases</th>
              <th>Purchase Amount</th>
            </tr>
          </thead>

          <tbody>
            {supplierData.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.totalPurchases}</td>
                <td>₹{Number(supplier.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Wise */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Product-wise Purchase</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Purchase Amount</th>
            </tr>
          </thead>

          <tbody>
            {productData.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>

                <td>{product.qty}</td>

                <td>₹{Number(product.amount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
