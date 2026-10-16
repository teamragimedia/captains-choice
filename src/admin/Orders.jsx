import "./Admin.css";
import API from "../api";
import { useCallback, useEffect, useState } from "react";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [nextStatus, setNextStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all orders.
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/orders");
      const data = res.data;

      setOrders(Array.isArray(data) ? data : data?.orders || []);
    } catch (err) {
      console.error("Failed to load orders:", err);

      setError(err.response?.data?.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Fetch one order and normalize customer/address data.
  const viewOrder = async (orderId) => {
    try {
      setDetailsLoading(true);
      setSelectedOrder(null);
      setError("");
      setSuccess("");

      const res = await API.get(`/orders/admin/${orderId}`);
      const rawOrder = res.data?.order || res.data;

      if (!rawOrder || !rawOrder.id) {
        throw new Error("The API did not return valid order details.");
      }

      // Support either a single address or an addresses array.
      const address =
        rawOrder.address ||
        rawOrder.addresses?.[0] ||
        rawOrder.delivery_address ||
        null;

      const customer = rawOrder.customer || {
        name: rawOrder.customer_name,
        email: rawOrder.customer_email,
        phone: rawOrder.customer_phone,
      };

      const normalizedOrder = {
        ...rawOrder,
        customer,
        address,
        items: Array.isArray(rawOrder.items) ? rawOrder.items : [],
      };

      setSelectedOrder(normalizedOrder);
      setNextStatus(String(normalizedOrder.status || "pending").toLowerCase());

      console.log("Admin order details:", normalizedOrder);
      console.log("Resolved delivery address:", address);
    } catch (err) {
      console.error("Failed to load order details:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load order details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Update order status.
  const updateOrderStatus = async () => {
    if (!selectedOrder?.id || !nextStatus) return;

    if (
      ["shipped", "delivered"].includes(nextStatus) &&
      String(selectedOrder.payment_status || "").toLowerCase() !== "paid"
    ) {
      setError(
        "This order cannot be shipped or delivered until payment is confirmed.",
      );
      return;
    }

    try {
      setSavingStatus(true);
      setError("");
      setSuccess("");

      const res = await API.patch(`/orders/${selectedOrder.id}/status`, {
        status: nextStatus,
      });

      const updatedOrder = res.data?.order || res.data?.updatedOrder || {};

      setSelectedOrder((current) => ({
        ...current,
        ...updatedOrder,
        status: updatedOrder.status || nextStatus,
      }));

      setSuccess("Order status updated successfully.");

      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);

      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const date = (value) => {
    if (!value) return "Not specified";

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
      ? String(value)
      : parsed.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const statusClass = (value) => {
    const status = String(value || "").toLowerCase();

    if (["delivered", "paid", "captured", "completed"].includes(status)) {
      return "green";
    }

    if (["cancelled", "failed", "refunded"].includes(status)) {
      return "red";
    }

    return "orange";
  };

  // Format an address without displaying missing values.
  const formatAddress = (address) => {
    if (!address) return [];

    return [
      address.address_line,
      [address.city, address.state].filter(Boolean).join(", "),
      [address.pincode, address.country].filter(Boolean).join(", "),
    ].filter((line) => Boolean(line && String(line).trim()));
  };

  const customer = selectedOrder?.customer;
  const address = selectedOrder?.address;
  const addressLines = formatAddress(address);

  return (
    <div className="admin-module-page">
      <div className="admin-module-header">
        <div>
          <h1>Orders</h1>
          <p>Track and manage customer orders</p>
        </div>

        <button
          type="button"
          className="admin-order-refresh"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Orders"}
        </button>
      </div>

      {error && <div className="admin-order-error">{error}</div>}
      {success && <div className="admin-order-success">{success}</div>}

      <div className="admin-module-card">
        <div className="admin-order-table-wrap">
          <table className="admin-module-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total</th>
                <th>Order Status</th>
                <th>Payment Status</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading orders...</td>
                </tr>
              ) : orders.length ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number || `ORD-${order.id}`}</td>
                    <td>{order.customer_id ?? "—"}</td>
                    <td>{money(order.total_price)}</td>
                    <td>
                      <span
                        className={`module-badge ${statusClass(order.status)}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`module-badge ${statusClass(
                          order.payment_status,
                        )}`}
                      >
                        {order.payment_status || "Pending"}
                      </span>
                    </td>
                    <td>{date(order.created_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-order-view-btn"
                        onClick={() => viewOrder(order.id)}
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailsLoading && (
        <div className="admin-order-overlay">
          <div className="admin-order-modal">
            <p>Loading order details...</p>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="admin-order-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <section
            className="admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-order-modal-header">
              <div>
                <h2 id="admin-order-title">
                  Order{" "}
                  {selectedOrder.order_number || `ORD-${selectedOrder.id}`}
                </h2>
                <p>Complete order information</p>
              </div>

              <button
                type="button"
                className="admin-order-close"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-order-details-grid">
              {/* Order information */}
              <div className="admin-order-info-card">
                <h3>Order Information</h3>

                <p>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Order Date:</strong> {date(selectedOrder.created_at)}
                </p>
                <p>
                  <strong>Delivery Date:</strong>{" "}
                  {date(selectedOrder.delivery_date)}
                </p>
                <p>
                  <strong>Delivery Time:</strong>{" "}
                  {selectedOrder.time_slot || "Not specified"}
                </p>
                <p>
                  <strong>Order Status:</strong>{" "}
                  {selectedOrder.status || "Pending"}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedOrder.payment_status || "Pending"}
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {selectedOrder.payment_method || "Not specified"}
                </p>
                <p>
                  <strong>Transaction ID:</strong>{" "}
                  {selectedOrder.transaction_id || "—"}
                </p>
                <p>
                  <strong>Notes:</strong>{" "}
                  {selectedOrder.notes || "No special instructions"}
                </p>

                <div className="admin-order-status-control">
                  <label htmlFor="order-status">
                    <strong>Update Order Status</strong>
                  </label>

                  <select
                    id="order-status"
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                    disabled={savingStatus}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="admin-order-view-btn"
                    onClick={updateOrderStatus}
                    disabled={
                      savingStatus ||
                      nextStatus ===
                        String(selectedOrder.status || "").toLowerCase()
                    }
                  >
                    {savingStatus ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Customer and delivery information */}
              <div className="admin-order-info-card">
                <h3>Customer Information</h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {customer?.name ||
                    customer?.full_name ||
                    address?.name ||
                    "—"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {customer?.email || selectedOrder.customer_email || "—"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {customer?.phone ||
                    address?.phone ||
                    selectedOrder.customer_phone ||
                    "—"}
                </p>

                <p>
                  <strong>Customer ID:</strong>{" "}
                  {selectedOrder.customer_id ?? "—"}
                </p>

                <h3 className="admin-order-subheading">Delivery Address</h3>

                {address ? (
                  <div className="admin-order-address">
                    {address.name && <p>{address.name}</p>}

                    {addressLines.length > 0 ? (
                      addressLines.map((line, index) => (
                        <p key={`${line}-${index}`}>{line}</p>
                      ))
                    ) : (
                      <p>Street and location details are not saved.</p>
                    )}

                    {address.phone && (
                      <p>
                        <strong>Phone:</strong> {address.phone}
                      </p>
                    )}

                    {address.type && (
                      <p>
                        <strong>Address Type:</strong> {address.type}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>
                    No address was returned by the API. Check the backend
                    response and the customer's saved addresses.
                  </p>
                )}
              </div>
            </div>

            {/* Ordered products */}
            <div className="admin-order-info-card admin-order-items-card">
              <h3>Products Ordered</h3>

              <div className="admin-order-table-wrap">
                <table className="admin-module-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(selectedOrder.items || []).map((item, index) => {
                      const price = Number(item.price ?? item.unit_price ?? 0);
                      const quantity = Number(item.quantity || 0);
                      const itemTotal =
                        item.total ?? item.total_price ?? price * quantity;

                      return (
                        <tr
                          key={`${
                            item.product_id || item.id || "item"
                          }-${index}`}
                        >
                          <td>{item.product_name || item.name || "Product"}</td>
                          <td>{item.sku || "—"}</td>
                          <td>{quantity}</td>
                          <td>{money(price)}</td>
                          <td>{money(itemTotal)}</td>
                        </tr>
                      );
                    })}

                    {!selectedOrder.items?.length && (
                      <tr>
                        <td colSpan="5">
                          No product details returned by the API.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="admin-order-totals">
                <p>
                  <span>Subtotal</span>
                  <strong>{money(selectedOrder.subtotal)}</strong>
                </p>
                <p>
                  <span>Discount</span>
                  <strong>{money(selectedOrder.discount)}</strong>
                </p>
                <p>
                  <span>GST</span>
                  <strong>{money(selectedOrder.gst)}</strong>
                </p>
                <p>
                  <span>Shipping</span>
                  <strong>{money(selectedOrder.shipping)}</strong>
                </p>
                <p className="admin-order-grand-total">
                  <span>Grand Total</span>
                  <strong>{money(selectedOrder.total_price)}</strong>
                </p>
              </div>
            </div>

            <div className="admin-order-modal-footer">
              <button
                type="button"
                className="admin-order-view-btn"
                onClick={() => setSelectedOrder(null)}
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
