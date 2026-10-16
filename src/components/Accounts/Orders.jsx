import React, { useEffect, useState } from "react";
import API from "../../api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setError("Please log in to view your orders.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await API.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = response.data;
        const customerOrders = Array.isArray(result)
          ? result
          : Array.isArray(result?.orders)
            ? result.orders
            : [];

        if (!cancelled) {
          setOrders(customerOrders);
        }
      } catch (err) {
        console.error(
          "Failed to fetch customer orders:",
          err.response?.data || err.message,
        );

        if (!cancelled) {
          setOrders([]);
          setError(
            err.response?.status === 401
              ? "Your session has expired. Please log in again."
              : err.response?.data?.message ||
                  "Unable to load your orders. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const statusStyle = (status) => {
    const value = String(status || "pending").toLowerCase();

    if (value === "paid" || value === "delivered" || value === "completed") {
      return { color: "#15803d", background: "#dcfce7" };
    }

    if (value === "cancelled" || value === "failed") {
      return { color: "#b91c1c", background: "#fee2e2" };
    }

    return { color: "#92400e", background: "#fef3c7" };
  };

  return (
    <div className="card">
      <h3>My Orders</h3>

      {loading ? (
        <p>Loading your orders...</p>
      ) : error ? (
        <div role="alert" style={{ padding: "16px 0" }}>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ cursor: "pointer" }}
          >
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: "620px",
            }}
          >
            <thead>
              <tr>
                {[
                  "Order Number",
                  "Date",
                  "Total",
                  "Payment",
                  "Order Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "14px 12px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: "13px",
                      color: "#6b7280",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td
                    style={{
                      padding: "16px 12px",
                      borderBottom: "1px solid #f0f0f0",
                      fontWeight: 600,
                    }}
                  >
                    {order.order_number || `#${order.id}`}
                  </td>

                  <td
                    style={{
                      padding: "16px 12px",
                      borderBottom: "1px solid #f0f0f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(order.created_at)}
                  </td>

                  <td
                    style={{
                      padding: "16px 12px",
                      borderBottom: "1px solid #f0f0f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatAmount(order.total_price)}
                  </td>

                  <td
                    style={{
                      padding: "16px 12px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        ...statusStyle(order.payment_status),
                        padding: "5px 9px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.payment_status || "Pending"}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "16px 12px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <span
                      style={{
                        ...statusStyle(order.status),
                        padding: "5px 9px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.status || "Processing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
