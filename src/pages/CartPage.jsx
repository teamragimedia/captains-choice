import { useEffect, useState } from "react";

import "../styles/CartPage.css";
import { Link } from "react-router-dom";
import BASE_URL from "../config";
import API from "../api";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const [notes, setNotes] = useState("");

  const [offerCode, setOfferCode] = useState("");

  const [discountPercent, setDiscountPercent] = useState(0);

  const [offerApplied, setOfferApplied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const customerId = localStorage.getItem("customerId");

    // User not logged in
    if (!token || !customerId) {
      setCart([]);
      setAddresses([]);
      return;
    }

    fetchCart();
    fetchAddresses();
  }, []);

  // ================= CART =================
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) return;

      const res = await API.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,

          customerid: customerId,
        },
      });

      setCart(res.data.cart);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= ADDRESS =================

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) return;

      const res = await API.get("/addresses/my", {
        headers: {
          Authorization: `Bearer ${token}`,

          customerid: customerId,
        },
      });

      setAddresses(res.data);

      const primary = res.data.find((a) => a.is_primary === 1);

      if (primary) {
        setSelectedAddress(primary.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (productId, newQty) => {
    try {
      const token = localStorage.getItem("token");

      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) return;

      // REMOVE ITEM

      if (newQty < 1) {
        await API.delete(`/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,

            customerid: customerId,
          },
        });

        // refresh page cart
        fetchCart();

        // refresh navbar count
        window.dispatchEvent(new Event("storage"));

        return;
      }

      // UPDATE

      await API.put(
        "/cart/update",
        {
          product_id: productId,

          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,

            customerid: customerId,
          },
        },
      );

      fetchCart();

      // refresh navbar count
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= oFFER =================
  const applyOffer = () => {
    if (offerCode === "FIRSTORDERCC") {
      setDiscountPercent(15);

      setOfferApplied(true);

      alert("Offer Applied ✅");
    } else {
      alert("Invalid Offer");
    }
  };

  // ================= rEMOVE OFFER====================

  const removeOffer = () => {
    setOfferApplied(false);

    setOfferCode("");

    setDiscountPercent(0);
  };

  // ================= TOTALS =================

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const discount = subtotal * (discountPercent / 100);

  const taxableAmount = subtotal - discount;

  const gst = taxableAmount * 0.18;

  const shipping = subtotal > 5000 ? 0 : 150;

  const total = taxableAmount + gst + shipping;

  // ================= EMPTY CART =================

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <h1>Your Cart is Empty 🛒</h1>

        <p>Add some fresh products to continue shopping</p>

        <button
          className="continue-btn"
          onClick={() => (window.location.href = "/shop")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // ================= Proceed Checkout CART PAGE =================
  const proceedToCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("customerId");

      if (!token || !customerId) {
        alert("Please login first");
        return;
      }

      if (!selectedAddress) {
        alert("Please select delivery address");
        return;
      }

      if (!deliveryDate) {
        alert("Please select delivery date");
        return;
      }

      if (!timeSlot || timeSlot === "Select Slot") {
        alert("Please select delivery slot");
        return;
      }

      const res = await API.post(
        "/orders/create",
        {
          address_id: selectedAddress,
          delivery_date: deliveryDate,
          time_slot: timeSlot,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            customerid: customerId,
          },
        },
      );

      console.log("ORDER CREATED:", res.data);

      alert("Order Created Successfully");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <>
      {/* BREADCRUMB */}
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
        {/* TOP */}
        <div className="cart-top">
          <div>
            <h1>Cart</h1>

            <p>{cart.length} items in your cart</p>
          </div>
          <Link to="/shop">
            <button className="continue-btn">Continue Shopping</button>
          </Link>
        </div>

        {/* NOTICE */}
        <div className="notice-box">
          Important Note : Minimum Cart value should be ₹2k to place an order
        </div>

        {/* LAYOUT */}
        <div className="cart-layout">
          {/* LEFT */}
          <div className="cart-left">
            {/* CART ITEMS */}
            <div className="cart-card">
              <div className="cart-header">
                <div>Product</div>

                <div>Price/kg</div>

                <div>Quantity</div>

                <div>Total</div>
              </div>

              {cart.map((item) => (
                <div className="cart-item" key={item.product_id}>
                  {/* PRODUCT */}
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

                  {/* PRICE */}
                  <div className="price">₹{item.price}</div>

                  {/* QTY */}
                  <div className="qty-box">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* TOTAL */}
                  <div className="price">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            {/* DELIVERY */}
            <div className="delivery-box">
              <h3>Delivery Options</h3>

              <div className="delivery-grid">
                <div>
                  <label>Delivery Date *</label>

                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Time Slot *</label>

                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option>Select Slot</option>

                    <option>7am - 11am</option>

                    <option>11am - 2pm</option>

                    <option>2pm - 5pm</option>
                  </select>
                </div>
              </div>
            </div>

            {/* NOTES */}
            <div className="note-box">
              <h3>Special Instructions</h3>

              <textarea
                placeholder="Any special requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* ADDRESS */}
            <div className="address-box">
              <h3>Delivery Address</h3>

              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`modern-address-card ${
                    selectedAddress === address.id
                      ? "active-modern-address"
                      : ""
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  {/* NAME */}
                  <div className="address-name">{address.name}</div>

                  {/* ADDRESS */}
                  <div className="address-line">{address.address_line}</div>

                  {/* CITY + PINCODE */}
                  <div className="address-city">
                    {address.city} - {address.pincode}
                  </div>

                  {/* PHONE */}
                  <div className="address-phone">{address.phone}</div>

                  {/* PRIMARY */}
                  {address.is_primary === 1 && (
                    <span className="modern-primary-badge">Primary</span>
                  )}

                  {/* SELECTED MESSAGE */}
                  {selectedAddress === address.id && (
                    <div className="selected-address-msg">
                      ✓ Selected — Your order will be delivered here
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            {/* OFFER */}
            <div className="offer-box">
              <label>Apply Offer Code</label>

              {!offerApplied ? (
                <div className="offer-row">
                  <input
                    placeholder="#FIRSTORDERCC"
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                  />

                  <button onClick={applyOffer}>Apply</button>
                </div>
              ) : (
                <div className="applied-offer">
                  <span>{offerCode}</span>

                  <button onClick={removeOffer}>Remove</button>
                </div>
              )}
            </div>

            {/* SAVING */}
            {offerApplied && (
              <div className="saving-box">
                <h4>Offer Applied. You're Saving</h4>

                <h2>₹{discount.toFixed(0)}</h2>
              </div>
            )}

            {/* TOTALS */}
            <div className="summary-row">
              <span>Subtotal</span>

              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row green">
              <span>Discount ({discountPercent}%)</span>

              <span>-₹{discount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>GST (18%)</span>

              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>

              <span>{shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row summary-total">
              <span>Total</span>

              <span>₹{total.toFixed(2)}</span>
            </div>

            <button className="help-btn">📞 Need Help? Contact Us</button>

            <button className="checkout-btn" onClick={proceedToCheckout}>
              🛒 Proceed to Checkout
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
