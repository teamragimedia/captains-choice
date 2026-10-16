import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/OrderConfirmation.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getOrderId = (location) => {
  const params = new URLSearchParams(location.search);

  return (
    params.get("orderId") ||
    params.get("order_id") ||
    location.state?.orderId ||
    sessionStorage.getItem("confirmedOrderId") ||
    ""
  );
};

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      const orderId = getOrderId(location);

      if (!orderId) {
        setError(
          "We couldn't find your order reference. Please open your order history to view your purchase.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Requires the authenticated backend endpoint described below.
        const response = await API.get(
          `/orders/${encodeURIComponent(orderId)}`,
        );

        const data = response.data?.order ?? response.data;

        if (!data || data.success === false) {
          throw new Error(
            data?.message || "Unable to load your order details.",
          );
        }

        if (
          data.payment_status &&
          String(data.payment_status).toLowerCase() !== "paid"
        ) {
          throw new Error(
            "Your payment is not confirmed yet. Please check your order status before trying again.",
          );
        }

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load your order. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [location]);

  const items = order?.items || order?.order_items || [];

  const address = order?.delivery_address || order?.address || {};

  const addressText =
    typeof address === "string"
      ? address
      : [
          address.name,
          address.address_line1 || address.address,
          address.address_line2,
          address.landmark,
          address.city,
          address.state,
          address.pincode || address.postal_code,
        ]
          .filter(Boolean)
          .join(", ");

  if (loading) {
    return (
      <main className="oc-page">
        <div className="oc-container">
          <section className="oc-state-card">
            <div className="oc-spinner" />
            <h1>Loading your order</h1>
            <p>Please wait while we retrieve your confirmed order details.</p>
          </section>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="oc-page">
        <div className="oc-container">
          <section className="oc-state-card oc-error-card">
            <div className="oc-error-icon">!</div>
            <h1>We couldn't load your order</h1>
            <p>{error || "Order details are unavailable."}</p>
            <div className="oc-actions">
              <button
                className="oc-button oc-button-primary"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
              <Link className="oc-button oc-button-secondary" to="/account">
                View my account
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const orderNumber =
    order.order_number || order.orderNumber || `Order #${order.id}`;

  const total = order.total_price ?? order.total ?? order.amount ?? 0;

  const subtotal = order.subtotal;
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const gst = Number(order.gst) || 0;

  const deliveryDate = order.delivery_date;
  const timeSlot = order.time_slot || order.timeSlot;
  const paymentId = order.payment_id || order.razorpay_payment_id || "";

  return (
    <main className="oc-page">
      <div className="oc-container">
        <section className="oc-success-card">
          <div className="oc-success-icon" aria-hidden="true">
            ✓
          </div>

          <p className="oc-eyebrow">Payment successful</p>

          <h1>Thank you for your order!</h1>

          <p className="oc-intro">
            Your payment has been confirmed. Thank you for choosing Captain’s
            Choice. We’re preparing your items.
          </p>

          <div className="oc-order-reference">
            <span>Order number</span>
            <strong>{orderNumber}</strong>
          </div>

          <div className="oc-confirmation-badge">
            <span className="oc-status-dot" />
            Order confirmed
          </div>
        </section>

        <div className="oc-content-grid">
          <section className="oc-card oc-items-card">
            <div className="oc-card-heading">
              <div>
                <p className="oc-section-kicker">YOUR PURCHASE</p>
                <h2>Items ordered</h2>
              </div>
              <span className="oc-item-count">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            {items.length > 0 ? (
              <div className="oc-items-list">
                {items.map((item, index) => {
                  const quantity = Number(item.quantity ?? item.qty ?? 1);

                  const price = Number(item.price ?? item.unit_price ?? 0);

                  const lineTotal = Number(
                    item.total ??
                      item.line_total ??
                      item.total_price ??
                      price * quantity,
                  );

                  const rawImage =
                    item.image_url || item.image || item.product_image || "";

                  const image = rawImage
                    ? /^https?:\/\//i.test(rawImage)
                      ? rawImage
                      : `${(
                          import.meta.env.VITE_SERVER_URL ||
                          "http://localhost:5000"
                        ).replace(/\/+$/, "")}/${
                          rawImage.replace(/^\/+/, "").startsWith("uploads/")
                            ? rawImage.replace(/^\/+/, "")
                            : `uploads/products/${rawImage.replace(/^\/+/, "")}`
                        }`
                    : "";

                  return (
                    <article
                      className="oc-product"
                      key={item.id || item.product_id || index}
                    >
                      <div className="oc-product-image">
                        {image ? (
                          <img
                            src={image}
                            alt={item.name || item.product_name || "Product"}
                            onError={(e) => {
                              console.error(
                                "Product image failed to load:",
                                e.currentTarget.src,
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span aria-hidden="true">📦</span>
                        )}
                      </div>

                      <div className="oc-product-info">
                        <h3>{item.name || item.product_name || "Product"}</h3>
                        {item.variant && <p>{item.variant}</p>}
                        <p>
                          Qty: {quantity} × {formatCurrency(price)}
                        </p>
                      </div>

                      <strong className="oc-product-total">
                        {formatCurrency(lineTotal)}
                      </strong>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="oc-empty-items">
                <p>Product details aren't available for this order.</p>
                <p>
                  Please open your account's order history for more information.
                </p>
              </div>
            )}
          </section>

          <aside className="oc-card oc-summary-card">
            <p className="oc-section-kicker">PAYMENT DETAILS</p>
            <h2>Order summary</h2>

            <div className="oc-summary-row">
              <span>Payment status</span>
              <strong className="oc-paid">Paid</strong>
            </div>

            <div className="oc-summary-row">
              <span>Payment method</span>
              <strong>Razorpay</strong>
            </div>

            {paymentId && (
              <div className="oc-payment-reference">
                <span>Payment reference</span>
                <strong>{paymentId}</strong>
              </div>
            )}

            <div className="oc-summary-divider" />

            {subtotal !== undefined && (
              <div className="oc-summary-row">
                <span>Order value</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="oc-summary-row oc-discount">
                <span>Discount</span>
                <span>−{formatCurrency(discount)}</span>
              </div>
            )}

            {gst > 0 && (
              <div className="oc-summary-row">
                <span>GST included</span>
                <span>{formatCurrency(gst)}</span>
              </div>
            )}

            <div className="oc-summary-row">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>

            <div className="oc-summary-divider" />

            <div className="oc-total-row">
              <span>Total paid</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <p className="oc-tax-note">
              Prices are inclusive of GST where applicable.
            </p>
          </aside>
        </div>

        <section className="oc-card oc-delivery-card">
          <div className="oc-delivery-heading">
            <div className="oc-delivery-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <div>
              <p className="oc-section-kicker">WHAT HAPPENS NEXT</p>
              <h2>Delivery details</h2>
              <p>Here’s where and when your order is scheduled to arrive.</p>
            </div>
          </div>

          <div className="oc-delivery-grid">
            <div className="oc-delivery-field">
              <span>DELIVERY ADDRESS</span>
              <strong>{address.name || order.customer_name || ""}</strong>
              <p>{addressText || "No delivery address was returned."}</p>
              {(address.phone || order.phone) && (
                <p>Phone: {address.phone || order.phone}</p>
              )}
            </div>

            <div className="oc-delivery-field">
              <span>DELIVERY DATE</span>
              <strong>{formatDate(deliveryDate)}</strong>
            </div>

            <div className="oc-delivery-field">
              <span>TIME SLOT</span>
              <strong>{timeSlot || "Not specified"}</strong>
            </div>
          </div>
        </section>

        <section className="oc-next-steps">
          <div>
            <h2>Need anything else?</h2>
            <p>
              Keep your order number handy for any questions about your
              delivery.
            </p>
          </div>

          <div className="oc-actions">
            <Link to="/shop" className="oc-button oc-button-primary">
              Continue shopping <span aria-hidden="true">→</span>
            </Link>

            <Link to="/account" className="oc-button oc-button-secondary">
              View my account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
