import "../../admin/Admin.css";
import { useEffect, useState } from "react";
import API from "../../api";

export default function ProfitReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get("/profit-reports");

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Profit Report</h1>
          <p>Bill-wise profitability analysis</p>
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Product</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Selling Price</th>
              <th>Purchase Cost</th>
              <th>Gross Profit</th>
              <th>Profit %</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.invoiceNo}</td>

                <td>{item.productName}</td>

                <td>{item.category}</td>

                <td>{item.quantity}</td>

                <td>₹{Number(item.sellingPrice).toLocaleString()}</td>

                <td>₹{Number(item.purchaseCost).toLocaleString()}</td>

                <td
                  style={{
                    color: item.grossProfit > 0 ? "#16a34a" : "#dc2626",
                    fontWeight: "600",
                  }}
                >
                  ₹{Number(item.grossProfit).toLocaleString()}
                </td>

                <td
                  style={{
                    color: item.profitPercentage > 0 ? "#16a34a" : "#dc2626",
                    fontWeight: "600",
                  }}
                >
                  {item.profitPercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
