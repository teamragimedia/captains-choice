import React, { useEffect, useState } from "react";
import API from "../../api";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = () => {
    API.get("/api/invoices/my").then((res) => {
      setInvoices(Array.isArray(res.data) ? res.data : []);
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Billing & Invoices</h3>
        <button className="download-all">Download All</button>
      </div>

      {invoices.length === 0 ? (
        <p>No invoices available</p>
      ) : (
        <div className="invoice-table">
          <div className="invoice-header">
            <span>Invoice</span>
            <span>Period</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {invoices.map((inv) => (
            <div className="invoice-row" key={inv._id}>
              <span>{inv.invoiceId}</span>
              <span>{inv.period}</span>
              <span>₹{inv.amount}</span>
              <span className="paid">Paid</span>
              <span>
                <button className="download-btn">Download</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Billing;
