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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#9333ea",
  "#0891b2",
];

export default function SalesReport() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  });

  const [trendData, setTrendData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerSales, setCustomerSales] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  const [filter, setFilter] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const [summaryRes, trendRes, productsRes, customersRes, distributionRes] =
        await Promise.all([
          API.get("/sales-reports/summary"),
          API.get("/sales-reports/trend?filter=monthly"),
          API.get("/sales-reports/top-products"),
          API.get("/sales-reports/customer-sales"),
          API.get("/sales-reports/distribution"),
        ]);

      setSummary(summaryRes.data);
      setTrendData(trendRes.data);
      setTopProducts(productsRes.data);
      setCustomerSales(customersRes.data);

      // IMPORTANT
      setDistributionData(
        distributionRes.data.map((item) => ({
          ...item,
          qty: Number(item.qty),
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const loadTrend = async (selectedFilter) => {
    try {
      setFilter(selectedFilter);

      const res = await API.get(
        `/sales-reports/trend?filter=${selectedFilter}`,
      );

      setTrendData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const applyCustomFilter = async () => {
    try {
      const res = await API.get(
        `/sales-reports/trend?from=${fromDate}&to=${toDate}`,
      );

      setTrendData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Sales Report</h1>
          <p>Sales analytics and business performance</p>
        </div>
      </div>

      {/* Filters */}

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
            className="date-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <span className="date-separator">to</span>

          <input
            type="date"
            className="date-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <button className="apply-btn" onClick={applyCustomFilter}>
            Apply
          </button>
        </div>
      </div>

      {/* KPI Cards */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>Total Sales</span>
          <h2>₹{Number(summary.totalSales).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Orders</span>
          <h2>{summary.totalOrders}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Average Order Value</span>
          <h2>₹{Number(summary.avgOrderValue).toFixed(2)}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Top Customer</span>
          <h2>{customerSales?.[0]?.name || "-"}</h2>
        </div>
        <div className="dashboard-mini-card">
          <span>Top Product</span>
          <h2>{topProducts?.[0]?.name || "-"}</h2>
        </div>
      </div>

      {/* Sales Trend */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Sales Trend</h3>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="label" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Top Selling Products</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Sales</th>
            </tr>
          </thead>

          <tbody>
            {topProducts.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>₹{Number(item.sales).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Sales */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Customer Wise Sales</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Orders</th>
              <th>Sales</th>
            </tr>
          </thead>

          <tbody>
            {customerSales.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.orders}</td>
                <td>₹{Number(item.sales).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Distribution */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Product Sales Distribution</h3>
        </div>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={distributionData}
                dataKey="qty"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => [`${value} Qty`, "Sold"]} />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
