import "../../admin/Admin.css";
import { useEffect, useState } from "react";
import API from "../../api";

export default function TransactionReport() {
  const [summary, setSummary] = useState({
    totalIn: 0,
    totalOut: 0,
    netCashFlow: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [transactionType, setTransactionType] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState("all");

  const [selectedVendor, setSelectedVendor] = useState("all");

  const [customers, setCustomers] = useState([]);

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    transactionType,
    selectedCustomer,
    selectedVendor,
    fromDate,
    toDate,
    transactions,
  ]);

  const fetchTransactions = async () => {
    try {
      const [summaryRes, transactionRes, customerRes, vendorRes] =
        await Promise.all([
          API.get("/transaction-reports/summary"),
          API.get("/transaction-reports"),
          API.get("/transaction-reports/customers"),
          API.get("/transaction-reports/vendors"),
        ]);

      setCustomers(customerRes.data);
      setVendors(vendorRes.data);

      setSummary(summaryRes.data);

      setTransactions(transactionRes.data);
      setFilteredTransactions(transactionRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = () => {
    let data = [...transactions];

    if (transactionType !== "all") {
      data = data.filter(
        (item) => item.type.toLowerCase() === transactionType.toLowerCase(),
      );
    }

    if (selectedCustomer !== "all") {
      data = data.filter((item) => item.party === selectedCustomer);
    }

    if (selectedVendor !== "all") {
      data = data.filter((item) => item.party === selectedVendor);
    }

    if (fromDate && toDate) {
      data = data.filter((item) => {
        const date = new Date(item.date);

        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }

    setFilteredTransactions(data);
  };

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Transaction Report</h1>
          <p>Consolidated sales and purchase transactions</p>
        </div>
      </div>

      {/* Filters */}

      <div className="purchase-filter-card">
        <select
          className="date-input"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="sales">Sales</option>
          <option value="purchase">Purchase</option>
        </select>

        <select
          className="date-input"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="all">All Customers</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </select>

        <select
          className="date-input"
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="all">All Vendors</option>

          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.supplier_name}>
              {vendor.supplier_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="date-input"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="date-input"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        {/* <button className="apply-btn" onClick={applyFilters}>
          Apply
        </button> */}
      </div>

      {/* Summary Cards */}

      <div className="dashboard-mini-grid">
        <div className="dashboard-mini-card">
          <span>Total Inflow</span>
          <h2>₹{Number(summary.totalIn).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Outflow</span>
          <h2>₹{Number(summary.totalOut).toLocaleString()}</h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Net Cash Flow</span>
          <h2
            style={{
              color: summary.netCashFlow >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            ₹{Number(summary.netCashFlow).toLocaleString()}
          </h2>
        </div>

        <div className="dashboard-mini-card">
          <span>Total Transactions</span>
          <h2>{filteredTransactions.length}</h2>
        </div>
      </div>

      {/* Transactions Table */}

      <div className="admin-table-card" style={{ marginTop: "30px" }}>
        <div className="table-header">
          <h3>Transaction History</h3>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Reference No</th>
              <th>Customer / Vendor</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={index}>
                <td>
                  <span
                    style={{
                      color:
                        transaction.type === "Sales" ? "#16a34a" : "#dc2626",
                      fontWeight: "600",
                    }}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td>{transaction.reference_no}</td>

                <td>{transaction.party}</td>

                <td>₹{Number(transaction.amount).toLocaleString()}</td>

                <td>
                  {new Date(transaction.date).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
