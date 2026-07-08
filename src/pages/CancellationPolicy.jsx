import React from "react";
import "../styles/PolicyPages.css";

function CancellationPolicy() {
  return (
    <div className="policy-page">
      <h1>Cancellation Policy</h1>

      <p className="policy-intro">
        At Captain&apos;s Choice, we aim to process and deliver every order as
        quickly as possible. This Cancellation Policy explains when and how an
        order may be cancelled by the customer or by Captain&apos;s Choice.
      </p>

      <p className="last-updated">Last Updated: July 2026</p>

      <section className="policy-section">
        <h2>1. Customer Order Cancellation</h2>
        <p>
          Customers may request cancellation only before an order enters
          processing, packing, or dispatch.
        </p>
        <ul>
          <li>Cancellation requests are subject to order status.</li>
          <li>
            Once an order has been packed or dispatched, cancellation may not be
            possible.
          </li>
          <li>Perishable products cannot be cancelled after dispatch.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>2. How to Request a Cancellation</h2>
        <p>Please contact our support team immediately with:</p>
        <ul>
          <li>Order ID</li>
          <li>Registered mobile number</li>
          <li>Reason for cancellation (optional)</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Cancellation by Captain&apos;s Choice</h2>
        <p>We reserve the right to cancel an order due to:</p>
        <ul>
          <li>Product unavailability.</li>
          <li>Pricing or technical errors.</li>
          <li>Payment verification failure.</li>
          <li>Suspected fraudulent activity.</li>
          <li>Non-serviceable delivery location.</li>
          <li>Government restrictions or operational constraints.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>4. Refund for Cancelled Orders</h2>
        <p>
          If a cancellation is approved, any eligible prepaid amount will be
          refunded to the original payment method.
        </p>
        <ul>
          <li>UPI: 2–5 business days</li>
          <li>Debit/Credit Cards: 5–7 business days</li>
          <li>Net Banking: 5–7 business days</li>
          <li>
            Actual credit timelines depend on your bank or payment provider.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>5. Orders Not Eligible for Cancellation</h2>
        <ul>
          <li>Orders already packed or dispatched.</li>
          <li>Delivered orders.</li>
          <li>Custom, bulk, or special procurement orders.</li>
          <li>Products that cannot be returned for food safety reasons.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>6. Force Majeure</h2>
        <p>
          Captain&apos;s Choice shall not be responsible for delays or
          cancellations caused by events beyond our reasonable control,
          including natural disasters, floods, strikes, transport disruptions,
          pandemics, or government actions.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Contact Information</h2>
        <div className="contact-box">
          <h3>Captain&apos;s Choice</h3>
          <p>India&apos;s Trusted B2B Food Supply Platform</p>
          <p>
            <strong>Address:</strong>
            <br />
            1st floor,No 273 30, 234 249 281
            <br />
            Y.V Annaiah Road, Yelachenahalli,
            <br />
            JP Nagar Bengaluru 560078
          </p>
          <p>
            <strong>Phone:</strong> +91 7899370617
          </p>
          <p>
            <strong>Email:</strong> Eightcap1986@gmail.com
          </p>
          <p>
            <strong>Support Hours:</strong>
            <br />
            Monday - Saturday
            <br />
            9:00 AM - 6:00 PM
          </p>
        </div>
      </section>
    </div>
  );
}

export default CancellationPolicy;
