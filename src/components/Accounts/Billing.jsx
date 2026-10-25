import React, { useEffect, useState } from "react";
import API from "../../api";
import "../../styles/Billing.css";

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/invoices/my");

      if (!data?.success) {
        throw new Error(data?.message || "Unable to load invoices.");
      }

      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch (err) {
      console.error("Fetch invoices error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load invoices.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(value) || 0);

  const date = (value) => {
    if (!value) return "—";

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const invoiceNumber = (invoice) =>
    invoice.invoice_number ||
    invoice.invoiceNumber ||
    invoice.invoice_id ||
    `INV-${invoice.id}`;

  const status = (invoice) =>
    invoice.payment_status ||
    invoice.paymentStatus ||
    invoice.status ||
    "Generated";

  const downloadInvoice = async (invoice) => {
    setError(
      `PDF download for ${invoiceNumber(invoice)} needs a customer invoice download endpoint.`,
    );
  };

  const downloadAll = () => {
    setError("Bulk PDF download is not connected yet.");
  };

  return (
    <section className="billing-page">
      <header className="billing-heading">
        <div>
          <span className="billing-eyebrow">YOUR ACCOUNT</span>
          <h2>Billing &amp; Invoices</h2>
          <p>Access your order invoices and payment records.</p>
        </div>

        <button
          className="billing-download-all"
          onClick={downloadAll}
          disabled={loading || invoices.length === 0}
          type="button"
        >
          <span>↓</span> Download All
        </button>
      </header>

      <div className="billing-summary">
        <div className="billing-summary-icon">▤</div>
        <div>
          <span>Total invoices</span>
          <strong>{loading ? "—" : invoices.length}</strong>
        </div>
      </div>

      <div className="billing-panel">
        {loading ? (
          <div className="billing-feedback">
            <span className="billing-spinner" />
            <p>Loading your invoices...</p>
          </div>
        ) : error ? (
          <div className="billing-feedback billing-feedback-error">
            <h3>Unable to load invoices</h3>
            <p>{error}</p>
            <button type="button" onClick={fetchInvoices}>
              Try again
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="billing-feedback">
            <div className="billing-empty-icon">▤</div>
            <h3>No invoices yet</h3>
            <p>
              Your invoices will appear here once they are generated for your
              orders.
            </p>
            <button type="button" onClick={fetchInvoices}>
              Refresh invoices
            </button>
          </div>
        ) : (
          <>
            <div className="billing-table-title">
              <div>
                <h3>Your invoices</h3>
                <p>Review your billing history below.</p>
              </div>
              <span className="billing-count">
                {invoices.length}{" "}
                {invoices.length === 1 ? "invoice" : "invoices"}
              </span>
            </div>

            <div className="billing-table-scroll">
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>INVOICE</th>
                    <th>INVOICE DATE</th>
                    <th>ORDER ID</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th className="billing-action-heading">ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => {
                    const currentStatus = String(status(invoice));
                    const isPaid = [
                      "paid",
                      "captured",
                      "completed",
                      "success",
                    ].includes(currentStatus.toLowerCase());

                    return (
                      <tr key={invoice.id}>
                        <td>
                          <div className="billing-invoice-cell">
                            <span className="billing-file-icon">PDF</span>
                            <strong>{invoiceNumber(invoice)}</strong>
                          </div>
                        </td>

                        <td>
                          {date(
                            invoice.invoice_date ||
                              invoice.created_at ||
                              invoice.createdAt,
                          )}
                        </td>

                        <td>
                          <span className="billing-order-id">
                            {invoice.order_number || invoice.order_id || "—"}
                          </span>
                        </td>

                        <td className="billing-amount">
                          {money(invoice.amount)}
                        </td>

                        <td>
                          <span
                            className={`billing-status ${
                              isPaid ? "is-paid" : "is-other"
                            }`}
                          >
                            <span className="billing-status-dot" />
                            {currentStatus}
                          </span>
                        </td>

                        <td>
                          <button
                            className="billing-download-one"
                            type="button"
                            onClick={() => downloadInvoice(invoice)}
                          >
                            ↓ <span>Download</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <p className="billing-security-note">
        Your invoices and billing information are available through your
        authenticated customer account.
      </p>
    </section>
  );
};

export default Billing;
