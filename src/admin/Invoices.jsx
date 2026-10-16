import "./Admin.css";
import API from "../api";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Currency formatter
  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Safely format MySQL and ISO dates.
  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    let date;

    if (value instanceof Date) {
      date = value;
    } else if (typeof value === "string") {
      // MySQL DATETIME: YYYY-MM-DD HH:mm:ss
      const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/,
      );

      if (match) {
        date = new Date(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3]),
          Number(match[4] || 0),
          Number(match[5] || 0),
          Number(match[6] || 0),
        );
      } else {
        date = new Date(value);
      }
    } else {
      date = new Date(value);
    }

    if (!date || Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Use the first populated date field.
  const getInvoiceDate = (invoice) =>
    invoice?.created_at ||
    invoice?.invoice_date ||
    invoice?.date ||
    invoice?.createdAt ||
    invoice?.order_created_at ||
    null;

  const getInvoiceLabel = (invoice) =>
    invoice?.invoice_number ||
    `INV-${String(invoice?.id ?? "").padStart(5, "0")}`;

  // Load invoices and orders.
  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [invoiceResponse, orderResponse] = await Promise.all([
        API.get("/invoices"),
        API.get("/orders"),
      ]);

      const invoiceData = invoiceResponse.data;
      const orderData = orderResponse.data;

      setInvoices(
        Array.isArray(invoiceData) ? invoiceData : invoiceData?.invoices || [],
      );

      setOrders(Array.isArray(orderData) ? orderData : orderData?.orders || []);
    } catch (err) {
      console.error("Load invoices error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load invoices. Please check your admin login.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // Avoid creating another invoice for an already-invoiced order.
  const invoicedOrderIds = useMemo(
    () =>
      new Set(
        invoices
          .filter((invoice) => invoice.order_id != null)
          .map((invoice) => String(invoice.order_id)),
      ),
    [invoices],
  );

  const availableOrders = useMemo(
    () => orders.filter((order) => !invoicedOrderIds.has(String(order.id))),
    [orders, invoicedOrderIds],
  );

  // Search invoice records.
  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return invoices;

    return invoices.filter((invoice) =>
      [
        invoice.id,
        invoice.invoice_number,
        invoice.order_id,
        invoice.order_number,
        invoice.customer_id,
        invoice.customer_name,
        invoice.customer_email,
        invoice.status,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [invoices, search]);

  // Create invoice from a saved order.
  const createInvoice = async (event) => {
    event.preventDefault();

    if (!selectedOrderId) {
      setError("Please select an order.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/invoices/create", {
        order_id: Number(selectedOrderId),
      });

      setSuccess(response.data?.message || "Invoice created successfully.");

      setSelectedOrderId("");
      await loadInvoices();
    } catch (err) {
      console.error("Create invoice error:", err);

      setError(err.response?.data?.message || "Unable to create invoice.");
    } finally {
      setCreating(false);
    }
  };

  // Load complete invoice details.
  const viewInvoice = async (invoice) => {
    setError("");

    try {
      const response = await API.get(`/invoices/${invoice.id}`);
      const detail = response.data?.invoice || response.data;

      // Preserve list fields if the detail response doesn't include them.
      setSelectedInvoice({
        ...invoice,
        ...detail,
      });
    } catch (err) {
      console.error("Invoice details error:", err);

      setError(
        err.response?.data?.message || "Unable to load invoice details.",
      );
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const totalInvoiced = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.amount || 0),
    0,
  );

  return (
    <div className="admin-module-page invoices-page">
      <div className="admin-module-header">
        <div>
          <h1>Invoices</h1>
          <p>Manage, view and create customer invoices</p>
        </div>

        <button
          type="button"
          className="admin-order-refresh"
          onClick={loadInvoices}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Invoices"}
        </button>
      </div>

      {error && (
        <div className="admin-order-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-order-success" role="status">
          {success}
        </div>
      )}

      {/* Summary */}
      <div className="admin-order-details-grid invoice-summary-grid">
        <div className="admin-order-info-card">
          <p>Total Invoices</p>
          <h2>{invoices.length}</h2>
        </div>

        <div className="admin-order-info-card">
          <p>Total Invoiced Value</p>
          <h2>{money(totalInvoiced)}</h2>
        </div>

        <div className="admin-order-info-card">
          <p>Orders Available to Invoice</p>
          <h2>{availableOrders.length}</h2>
        </div>
      </div>

      {/* Create invoice */}
      <div className="admin-module-card invoice-create-card">
        <h2>Create Invoice</h2>
        <p>
          Select an existing order. The backend will use the saved order amount
          instead of an amount entered manually.
        </p>

        <form onSubmit={createInvoice} className="invoice-create-form">
          <select
            value={selectedOrderId}
            onChange={(event) => setSelectedOrderId(event.target.value)}
            required
            disabled={creating || availableOrders.length === 0}
            aria-label="Select order"
          >
            <option value="">Select an order</option>

            {availableOrders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.order_number || `Order ${order.id}`} — Customer{" "}
                {order.customer_id ?? "—"} — {money(order.total_price)}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="admin-order-view-btn"
            disabled={creating || !selectedOrderId}
          >
            {creating ? "Creating..." : "Create Invoice"}
          </button>
        </form>

        {availableOrders.length === 0 && !loading && (
          <p>
            No orders are available for invoicing. Existing invoices are not
            duplicated.
          </p>
        )}
      </div>

      {/* Invoice records */}
      <div className="admin-module-card invoice-list-card">
        <div className="invoice-list-header">
          <div>
            <h2>Invoice Records</h2>
            <p>View and print saved invoice records.</p>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoices..."
            aria-label="Search invoices"
          />
        </div>

        <div className="admin-order-table-wrap">
          <table className="admin-module-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading invoices...</td>
                </tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{getInvoiceLabel(invoice)}</td>

                    <td>{invoice.order_number || invoice.order_id || "—"}</td>

                    <td>
                      <div>{invoice.customer_name || "—"}</div>
                      <small>{invoice.customer_email || ""}</small>
                    </td>

                    <td>{formatDate(getInvoiceDate(invoice))}</td>

                    <td>{money(invoice.amount)}</td>

                    <td>{invoice.status || "Pending"}</td>

                    <td>
                      <button
                        type="button"
                        className="admin-order-view-btn"
                        onClick={() => viewInvoice(invoice)}
                      >
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    No invoices found. Create an invoice from an existing order.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice details modal */}
      {selectedInvoice && (
        <div
          className="admin-order-overlay invoice-overlay"
          onClick={() => setSelectedInvoice(null)}
        >
          <section
            className="admin-order-modal invoice-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Invoice details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-order-modal-header no-print">
              <div>
                <h2>{getInvoiceLabel(selectedInvoice)}</h2>
                <p>Invoice details</p>
              </div>

              <button
                type="button"
                className="admin-order-close"
                onClick={() => setSelectedInvoice(null)}
                aria-label="Close invoice"
              >
                ×
              </button>
            </div>

            <div className="invoice-document">
              <div className="invoice-brand">
                <div>
                  <h1>Captain&apos;s Choice</h1>
                  <p>INVOICE</p>
                </div>

                <div className="invoice-number-block">
                  <strong>{getInvoiceLabel(selectedInvoice)}</strong>
                  <p>Date: {formatDate(getInvoiceDate(selectedInvoice))}</p>
                </div>
              </div>

              <hr />

              <div className="invoice-customer-grid">
                <div>
                  <h3>Bill To</h3>
                  <p>
                    <strong>
                      {selectedInvoice.customer_name || "Customer"}
                    </strong>
                  </p>
                  <p>{selectedInvoice.customer_email || "Email unavailable"}</p>
                  <p>{selectedInvoice.customer_phone || "Phone unavailable"}</p>
                  <p>Customer ID: {selectedInvoice.customer_id ?? "—"}</p>
                </div>

                <div>
                  <h3>Order Information</h3>
                  <p>
                    <strong>Order:</strong>{" "}
                    {selectedInvoice.order_number ||
                      selectedInvoice.order_id ||
                      "—"}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {selectedInvoice.payment_status || "—"}
                  </p>
                  <p>
                    <strong>Method:</strong>{" "}
                    {selectedInvoice.payment_method || "—"}
                  </p>
                  <p>
                    <strong>Invoice Status:</strong>{" "}
                    {selectedInvoice.status || "Pending"}
                  </p>
                </div>
              </div>

              <h3>Invoice Summary</h3>

              <table className="admin-module-table invoice-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Order ID</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Order total</td>
                    <td>
                      {selectedInvoice.order_number ||
                        selectedInvoice.order_id ||
                        "—"}
                    </td>
                    <td>{money(selectedInvoice.amount)}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th colSpan="2">Invoice Total</th>
                    <th>{money(selectedInvoice.amount)}</th>
                  </tr>
                </tfoot>
              </table>

              <p className="invoice-note">
                This invoice summary reflects the amount stored in the invoice
                record. Confirm seller details, billing address, GSTIN, item
                descriptions and tax breakdown before using it as a formal GST
                tax invoice.
              </p>
            </div>

            <div className="admin-order-modal-footer no-print">
              <button
                type="button"
                className="admin-order-view-btn"
                onClick={printInvoice}
              >
                Print / Save as PDF
              </button>

              <button
                type="button"
                className="admin-order-refresh"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
