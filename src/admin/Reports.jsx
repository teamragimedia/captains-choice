import "./Admin.css";
import { useEffect, useState } from "react";
import API from "../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Reports() {
  const [report, setReport] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    totalWaste: 0,
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const [summaryRes, trendRes, topProductsRes] = await Promise.all([
        API.get("/reports"),
        API.get("/reports/sales-trend"),
        API.get("/reports/top-products"),
      ]);

      setTopProducts(topProductsRes.data);

      setReport(summaryRes.data);
      setSalesTrend(
        trendRes.data.map((item) => ({
          ...item,
          day: new Date(item.day).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [salesTrend, setSalesTrend] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Reports</h1>
          <p>Business reports and exports</p>
        </div>
      </div>

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>Total Sales</span>
          <h2>₹{Number(report.totalSales).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Orders</span>
          <h2>{report.totalOrders}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Waste</span>
          <h2>{report.totalWaste} KG</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Customers</span>
          <h2>{report.totalCustomers}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Avg Order Value</span>
          <h2>₹{Number(report.avgOrderValue).toFixed(2)}</h2>
        </div>
      </div>

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Sales Trend</h3>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  "Sales",
                ]}
              />

              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={4}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Top Selling Products</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Units Sold</th>
            </tr>
          </thead>

          <tbody>
            {topProducts.map((product, index) => (
              <tr key={product.id}>
                <td>#{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.sold_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
