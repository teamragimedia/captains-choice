import { useCallback, useEffect, useState } from "react";
import "../styles/CartPage.css";
import { Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import API from "../api";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    let script = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    if (script) {
      if (script.dataset.loaded === "true" && window.Razorpay) {
        resolve(true);
        return;
      }

      script.addEventListener("load", () => resolve(Boolean(window.Razorpay)), {
        once: true,
      });

      script.addEventListener("error", () => resolve(false), {
        once: true,
      });

      return;
    }

    script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve(Boolean(window.Razorpay));
    };

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [notes, setNotes] = useState("");

  const [offerCode, setOfferCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [offerApplied, setOfferApplied] = useState(false);

  const [serverTotals, setServerTotals] = useState(null);
  const [isLoadingTotals, setIsLoadingTotals] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    return {
      token,
      customerId,
      headers: {
        Authorization: `Bearer ${token || ""}`,
        customerid: customerId || "",
      },
    };
  }, []);

  // ---------------- CART ----------------

  const fetchCart = useCallback(async () => {
    const { token, customerId, headers } = getAuthConfig();

    if (!token || !customerId) {
      setCart([]);
      return [];
    }

    try {
      const response = await API.get("/cart", { headers });
      const items = Array.isArray(response.data?.cart)
        ? response.data.cart
        : [];

      setCart(items);
      return items;
    } catch (error) {
      console.error(
        "Unable to load cart:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }, [getAuthConfig]);

  // Notify the navbar and other components that the cart changed.
  const notifyCartUpdated = useCallback(() => {
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  // ---------------- SERVER TOTALS ----------------

  const fetchOrderPreview = useCallback(
    async (requestedOfferCode = "") => {
      const { token, customerId, headers } = getAuthConfig();

      if (!token || !customerId) {
        setServerTotals(null);
        return null;
      }

      setIsLoadingTotals(true);

      try {
        const response = await API.get("/orders/preview", {
          params: { offerCode: requestedOfferCode },
          headers,
        });

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Unable to calculate order totals.",
          );
        }

        const totals = response.data.totals || null;
        setServerTotals(totals);
        return totals;
      } catch (error) {
        console.error(
          "Unable to preview order totals:",
          error.response?.data || error.message,
        );

        setServerTotals(null);
        throw error;
      } finally {
        setIsLoadingTotals(false);
      }
    },
    [getAuthConfig],
  );

  // ---------------- ADDRESSES ----------------

  const fetchAddresses = useCallback(async () => {
    const { token, customerId, headers } = getAuthConfig();

    if (!token || !customerId) {
      setAddresses([]);
      setSelectedAddress(null);
      return;
    }

    try {
      const response = await API.get("/addresses/my", { headers });
      const addressList = Array.isArray(response.data) ? response.data : [];

      setAddresses(addressList);

      setSelectedAddress((currentAddress) => {
        const currentStillExists = addressList.some(
          (address) => String(address.id) === String(currentAddress),
        );

        if (currentStillExists) return currentAddress;

        const primary = addressList.find(
          (address) =>
            address.is_primary === 1 ||
            address.is_primary === true ||
            address.is_primary === "1",
        );

        return primary?.id ?? addressList[0]?.id ?? null;
      });
    } catch (error) {
      console.error(
        "Unable to load addresses:",
        error.response?.data || error.message,
      );
    }
  }, [getAuthConfig]);

  useEffect(() => {
    const { token, customerId } = getAuthConfig();

    if (!token || !customerId) {
      setCart([]);
      setAddresses([]);
      setSelectedAddress(null);
      setServerTotals(null);
      return;
    }

    fetchCart().catch(() => {});
    fetchAddresses();
    fetchOrderPreview().catch(() => {});
  }, [getAuthConfig, fetchCart, fetchAddresses, fetchOrderPreview]);

  useEffect(() => {
    if (!cart.length) {
      setServerTotals(null);
      return;
    }

    fetchOrderPreview(offerApplied ? offerCode : "").catch(() => {});
  }, [cart, offerApplied, offerCode, fetchOrderPreview]);

  // ---------------- QUANTITY ----------------

  const updateQuantity = async (productId, newQuantity) => {
    const { token, customerId, headers } = getAuthConfig();

    if (!token || !customerId) {
      alert("Please login first.");
      return;
    }

    try {
      if (newQuantity < 1) {
        await API.delete(`/cart/${productId}`, { headers });
      } else {
        await API.put(
          "/cart/update",
          {
            product_id: productId,
            quantity: newQuantity,
          },
          { headers },
        );
      }

      await fetchCart();
      notifyCartUpdated();
    } catch (error) {
      console.error(
        "Unable to update cart:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Unable to update your cart. Please try again.",
      );
    }
  };

  // ---------------- OFFER ----------------

  const applyOffer = async () => {
    const code = offerCode.trim().toUpperCase();

    if (!code) {
      alert("Please enter an offer code.");
      return;
    }

    try {
      await fetchOrderPreview(code);

      setOfferCode(code);
      setDiscountPercent(code === "FIRSTORDERCC" ? 15 : 0);
      setOfferApplied(true);

      alert("Offer applied.");
    } catch (error) {
      setOfferApplied(false);
      setDiscountPercent(0);
      setServerTotals(null);

      alert(
        error.response?.data?.message ||
          error.message ||
          "This offer cannot be applied.",
      );
    }
  };

  const removeOffer = () => {
    setOfferApplied(false);
    setOfferCode("");
    setDiscountPercent(0);
    fetchOrderPreview("").catch(() => {});
  };

  // ---------------- TOTALS ----------------

  const subtotal = Number(
    serverTotals?.subtotal ??
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
  );

  const discount = Number(serverTotals?.discount ?? 0);

  const discountPercentFromServer = Number(
    serverTotals?.discountPercent ?? discountPercent,
  );

  const shipping = Number(serverTotals?.shipping ?? 0);
  const total = Number(serverTotals?.total ?? 0);

  const totalsReady = Boolean(serverTotals) && !isLoadingTotals;

  // ---------------- VERIFY PAYMENT ----------------

  const verifyPayment = async (
    order,
    paymentResponse,
    auth,
    checkoutDetails,
  ) => {
    if (isVerifyingPayment) return;

    setIsVerifyingPayment(true);

    try {
      const verification = await API.post(
        "/payments/verify",
        {
          orderId: order.orderId,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        },
        { headers: auth.headers },
      );

      if (!verification.data?.success) {
        throw new Error(
          verification.data?.message ||
            "Payment verification has not completed.",
        );
      }

      /*
       * Payment is confirmed by the backend.
       *
       * The backend must also clear this customer's database cart
       * after successful verification. This request refreshes the
       * frontend from that authoritative database state.
       */
      try {
        await fetchCart();
      } catch (refreshError) {
        // Don't treat a cart-refresh failure as payment failure.
        // The payment was already confirmed by the backend.
        console.error(
          "Payment confirmed, but cart refresh failed:",
          refreshError.message,
        );

        setCart([]);
      }

      notifyCartUpdated();

      // Keep the confirmed order ID available if the page is refreshed.
      sessionStorage.setItem("confirmedOrderId", String(order.orderId));

      navigate("/order-success", {
        replace: true,
        state: {
          ...checkoutDetails,
          orderId: order.orderId,
          orderNumber: order.orderNumber || `Order ${order.orderId}`,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          amount: Number(order.amount) / 100,
          currency: order.currency || "INR",
          paymentStatus: "paid",
          status: "processing",
          paidAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error(
        "Payment verification failed:",
        error.response?.data || error.message,
      );

      alert(
        "Payment was submitted, but confirmation is pending. " +
          "Please check your order status before attempting another payment.",
      );
    } finally {
      setIsVerifyingPayment(false);
      setIsCheckingOut(false);
    }
  };

  // ---------------- RAZORPAY CHECKOUT ----------------

  const proceedToCheckout = async () => {
    if (isCheckingOut || isVerifyingPayment) return;

    const auth = getAuthConfig();

    if (!auth.token || !auth.customerId) {
      alert("Please login first.");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    if (!deliveryDate) {
      alert("Please select a delivery date.");
      return;
    }

    if (!timeSlot) {
      alert("Please select a delivery time slot.");
      return;
    }

    if (subtotal < 2000) {
      alert("Minimum order value is ₹2,000.");
      return;
    }

    if (!totalsReady || !serverTotals) {
      alert("Order totals are still loading. Please try again.");
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await API.post(
        "/orders/create",
        {
          address_id: selectedAddress,
          delivery_date: deliveryDate,
          time_slot: timeSlot,
          notes,
          offerCode: offerApplied ? offerCode : "",
        },
        { headers: auth.headers },
      );

      const order = response.data;

      if (
        !order?.success ||
        !order?.keyId ||
        !order?.razorpayOrderId ||
        order?.orderId == null ||
        !Number.isSafeInteger(Number(order.amount)) ||
        Number(order.amount) <= 0
      ) {
        throw new Error(
          order?.message ||
            "The server did not return all required Razorpay order details.",
        );
      }

      if (order.currency && order.currency !== "INR") {
        throw new Error("Unexpected payment currency returned by server.");
      }

      const selectedAddressDetails = addresses.find(
        (address) => String(address.id) === String(selectedAddress),
      );

      const checkoutDetails = {
        items: cart.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          image: item.image,
          weight: item.weight,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0),
          lineTotal: Number(item.price || 0) * Number(item.quantity || 0),
        })),

        address: selectedAddressDetails
          ? {
              name: selectedAddressDetails.name,
              address_line: selectedAddressDetails.address_line,
              city: selectedAddressDetails.city,
              pincode: selectedAddressDetails.pincode,
              phone: selectedAddressDetails.phone,
            }
          : null,

        deliveryDate,
        timeSlot,
        notes,
        subtotal: Number(serverTotals?.subtotal ?? subtotal),
        discount: Number(serverTotals?.discount ?? discount),
        shipping: Number(serverTotals?.shipping ?? shipping),
        total: Number(order.amount) / 100,
      };

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay Checkout could not load. Please check your internet connection.",
        );
      }

      const options = {
        key: order.keyId,
        amount: Number(order.amount),
        currency: order.currency || "INR",
        name: "Captain's Choice",
        description: `Order ${order.orderNumber || order.orderId}`,
        order_id: order.razorpayOrderId,

        handler: (paymentResponse) => {
          verifyPayment(order, paymentResponse, auth, checkoutDetails);
        },

        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
          },
        },

        theme: {
          color: "#214321",
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (event) => {
        console.error(
          "Razorpay payment failed:",
          event?.error?.code,
          event?.error?.description,
        );

        alert(event?.error?.description || "Payment failed. Please try again.");

        setIsCheckingOut(false);
      });

      checkout.open();
    } catch (error) {
      console.error(
        "Checkout could not start:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to start checkout. Please try again.",
      );

      setIsCheckingOut(false);
    }
  };

  // ---------------- EMPTY CART ----------------

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <h1>Your Cart is Empty 🛒</h1>
        <p>Add some fresh products to continue shopping</p>

        <button
          type="button"
          className="continue-btn"
          onClick={() => navigate("/shop")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ---------------- CART PAGE ----------------

  return (
    <>
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb">
          <Link to="/">
            <span>Home</span>
          </Link>

          <span className="breadcrumb-separator">/</span>
          <span className="active-breadcrumb">Cart</span>
        </div>
      </div>

      <div className="cart-page">
        <div className="cart-top">
          <div>
            <h1>Cart</h1>
            <p>
              {cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}{" "}
              items in your cart
            </p>
          </div>

          <Link to="/shop">
            <button type="button" className="continue-btn">
              Continue Shopping
            </button>
          </Link>
        </div>

        <div className="notice-box">
          Important Note: Minimum Cart value should be ₹2k to place an order
        </div>

        <div className="cart-layout">
          <div className="cart-left">
            <div className="cart-card">
              <div className="cart-header">
                <div>Product</div>
                <div>Price/kg</div>
                <div>Quantity</div>
                <div>Total</div>
              </div>

              {cart.map((item) => (
                <div className="cart-item" key={item.product_id}>
                  <div className="product-side">
                    <img
                      src={`${BASE_URL}/uploads/products/${item.image}`}
                      alt={item.name}
                    />

                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <p>{item.weight}</p>
                    </div>
                  </div>

                  <div className="price">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </div>

                  <div className="qty-box">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) - 1,
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) + 1,
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="price">
                    ₹
                    {(
                      Number(item.price || 0) * Number(item.quantity || 0)
                    ).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="delivery-box">
              <h3>Delivery Options</h3>

              <div className="delivery-grid">
                <div>
                  <label htmlFor="delivery-date">Delivery Date *</label>

                  <input
                    id="delivery-date"
                    type="date"
                    min={new Date().toLocaleDateString("en-CA")}
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="delivery-slot">Time Slot *</label>

                  <select
                    id="delivery-slot"
                    value={timeSlot}
                    onChange={(event) => setTimeSlot(event.target.value)}
                  >
                    <option value="">Select Slot</option>
                    <option value="7am - 11am">7am - 11am</option>
                    <option value="11am - 2pm">11am - 2pm</option>
                    <option value="2pm - 5pm">2pm - 5pm</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="note-box">
              <h3>Special Instructions</h3>

              <textarea
                placeholder="Any special requirements..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <div className="address-box">
              <h3>Delivery Address</h3>

              {addresses.length === 0 && (
                <p>
                  No saved addresses found. Please add a delivery address before
                  checkout.
                </p>
              )}

              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`modern-address-card ${
                    String(selectedAddress) === String(address.id)
                      ? "active-modern-address"
                      : ""
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="address-name">{address.name}</div>

                  <div className="address-line">{address.address_line}</div>

                  <div className="address-city">
                    {address.city} - {address.pincode}
                  </div>

                  <div className="address-phone">{address.phone}</div>

                  {(address.is_primary === 1 ||
                    address.is_primary === true ||
                    address.is_primary === "1") && (
                    <span className="modern-primary-badge">Primary</span>
                  )}

                  {String(selectedAddress) === String(address.id) && (
                    <div className="selected-address-msg">
                      ✓ Selected — Your order will be delivered here
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="offer-box">
              <label htmlFor="offer-code">Apply Offer Code</label>

              {!offerApplied ? (
                <div className="offer-row">
                  <input
                    id="offer-code"
                    placeholder="#FIRSTORDERCC"
                    value={offerCode}
                    onChange={(event) => setOfferCode(event.target.value)}
                  />

                  <button
                    type="button"
                    onClick={applyOffer}
                    disabled={isLoadingTotals}
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="applied-offer">
                  <span>{offerCode}</span>

                  <button type="button" onClick={removeOffer}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {offerApplied && (
              <div className="saving-box">
                <h4>Offer Applied. You're Saving</h4>
                <h2>₹{discount.toFixed(2)}</h2>
              </div>
            )}

            <div className="summary-row">
              <span>Order Value</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row green">
                <span>Discount ({discountPercentFromServer}%)</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>
                {totalsReady ? `₹${total.toFixed(2)}` : "Calculating..."}
              </span>
            </div>

            <p
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "8px",
              }}
            >
              * Prices are inclusive of GST
            </p>

            <button type="button" className="help-btn">
              📞 Need Help? Contact Us
            </button>

            <button
              type="button"
              className="checkout-btn"
              onClick={proceedToCheckout}
              disabled={
                isCheckingOut ||
                isVerifyingPayment ||
                isLoadingTotals ||
                !totalsReady
              }
            >
              {isVerifyingPayment
                ? "Verifying Payment..."
                : isCheckingOut
                  ? "Opening Checkout..."
                  : "🛒 Proceed to Checkout"}
            </button>

            <div className="checkout-features">
              <p>✔ Free delivery on orders above ₹5,000</p>
              <p>✔ GST invoice with ITC available</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
