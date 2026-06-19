import "../../admin/Admin.css";
import { useEffect, useState } from "react";
import API from "../../api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ComparisonReport() {
  const [summary, setSummary] = useState({
    currentMonth: {
      sales: 0,
      orders: 0,
    },
    lastMonth: {
      sales: 0,
      orders: 0,
    },
    currentYear: {
      sales: 0,
      orders: 0,
    },
    lastYear: {
      sales: 0,
      orders: 0,
    },
  });

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      const { data } = await API.get("/comparison-reports/summary");

      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const monthComparison = [
    {
      period: "Last Month",
      sales: Number(summary.lastMonth?.sales || 0),
      orders: Number(summary.lastMonth?.orders || 0),
    },
    {
      period: "This Month",
      sales: Number(summary.currentMonth?.sales || 0),
      orders: Number(summary.currentMonth?.orders || 0),
    },
  ];

  const yearComparison = [
    {
      period: "Last Year",
      sales: Number(summary.lastYear?.sales || 0),
      orders: Number(summary.lastYear?.orders || 0),
    },
    {
      period: "This Year",
      sales: Number(summary.currentYear?.sales || 0),
      orders: Number(summary.currentYear?.orders || 0),
    },
  ];

  const monthGrowth =
    summary.lastMonth?.sales > 0
      ? (
          ((summary.currentMonth.sales - summary.lastMonth.sales) /
            summary.lastMonth.sales) *
          100
        ).toFixed(1)
      : 0;

  const yearGrowth =
    summary.lastYear?.sales > 0
      ? (
          ((summary.currentYear.sales - summary.lastYear.sales) /
            summary.lastYear.sales) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Comparison Report</h1>
          <p>Compare current performance with previous periods</p>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>This Month Sales</span>
          <h2>₹{Number(summary.currentMonth?.sales || 0).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Last Month Sales</span>
          <h2>₹{Number(summary.lastMonth?.sales || 0).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>This Year Sales</span>
          <h2>₹{Number(summary.currentYear?.sales || 0).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Last Year Sales</span>
          <h2>₹{Number(summary.lastYear?.sales || 0).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Monthly Growth</span>
          <h2
            style={{
              color: Number(monthGrowth) >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            {monthGrowth}%
          </h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Yearly Growth</span>
          <h2
            style={{
              color: Number(yearGrowth) >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            {yearGrowth}%
          </h2>
        </div>
      </div>

      {/* MONTH COMPARISON */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>This Month vs Last Month</h3>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={monthComparison}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />

              <YAxis />

              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />

              <Legend />

              <Bar
                dataKey="sales"
                fill="#2563eb"
                name="Sales"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* YEAR COMPARISON */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>This Year vs Last Year</h3>
        </div>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={yearComparison}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />

              <YAxis />

              <Tooltip
                formatter={(value) => `₹${Number(value).toLocaleString()}`}
              />

              <Legend />

              <Bar
                dataKey="sales"
                fill="#16a34a"
                name="Sales"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMPARISON TABLE */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Comparison Summary</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current Period</th>
              <th>Previous Period</th>
              <th>Growth</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Monthly Sales</td>

              <td>₹{Number(summary.currentMonth.sales).toLocaleString()}</td>

              <td>₹{Number(summary.lastMonth.sales).toLocaleString()}</td>

              <td>{monthGrowth}%</td>
            </tr>

            <tr>
              <td>Yearly Sales</td>

              <td>₹{Number(summary.currentYear.sales).toLocaleString()}</td>

              <td>₹{Number(summary.lastYear.sales).toLocaleString()}</td>

              <td>{yearGrowth}%</td>
            </tr>

            <tr>
              <td>Monthly Orders</td>

              <td>{summary.currentMonth.orders}</td>

              <td>{summary.lastMonth.orders}</td>

              <td>{summary.currentMonth.orders - summary.lastMonth.orders}</td>
            </tr>

            <tr>
              <td>Yearly Orders</td>

              <td>{summary.currentYear.orders}</td>

              <td>{summary.lastYear.orders}</td>

              <td>{summary.currentYear.orders - summary.lastYear.orders}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
