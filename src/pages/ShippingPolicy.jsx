import React from "react";
import "../styles/PolicyPages.css";

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <h1>Shipping Policy</h1>

      <p>
        The orders for the user are shipped through registered domestic courier
        companies and/or Speed Post only.
      </p>

      <section className="policy-section">
        <h2>Order Processing & Shipping</h2>

        <p>
          Orders are shipped within
          <strong> 6 days </strong>
          from the date of the order and/or payment, or as per the delivery date
          agreed at the time of order confirmation, subject to courier company
          or postal service norms.
        </p>
      </section>

      <section className="policy-section">
        <h2>Delivery</h2>

        <p>
          Delivery of all orders will be made to the address provided by the
          buyer at the time of purchase.
        </p>

        <p>
          Delivery of our services will be confirmed through the email ID
          specified by you at the time of registration.
        </p>
      </section>

      <section className="policy-section">
        <h2>Delivery Delays</h2>

        <p>
          The Platform Owner shall not be liable for any delay in delivery
          caused by the courier company or postal authority, as deliveries are
          subject to their operational norms and timelines.
        </p>
      </section>

      <section className="policy-section">
        <h2>Shipping Charges</h2>

        <p>
          If any shipping charges are levied by the seller or the Platform
          Owner, as applicable, such shipping charges are
          <strong> non-refundable</strong>.
        </p>
      </section>
    </div>
  );
}

export default ShippingPolicy;
