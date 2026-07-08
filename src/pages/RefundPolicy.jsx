import React from "react";
import "../styles/PolicyPages.css";

function RefundPolicy() {
  return (
    <div className="policy-page">
      <h1>Refund, Return & Cancellation Policy</h1>

      <p className="policy-intro">
        At Captain&apos;s Choice, we are committed to delivering fresh,
        high-quality products and providing a transparent shopping experience.
        This policy explains our return, replacement, refund and cancellation
        procedures.
      </p>

      <p className="last-updated">Last Updated: July 2026</p>

      <section className="policy-section">
        <h2>1. Return Eligibility</h2>
        <p>
          Due to the nature of food and perishable products, returns are
          generally not accepted after delivery except in the following cases:
        </p>
        <ul>
          <li>Damaged products.</li>
          <li>Incorrect products delivered.</li>
          <li>Missing items.</li>
          <li>Expired or verified quality issues.</li>
        </ul>
        <p>
          Issues must be reported within <strong>24 hours</strong> of delivery
          with photographs and Order ID.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. Conditions for Approval</h2>
        <ul>
          <li>Request submitted within 24 hours.</li>
          <li>Original packaging available wherever applicable.</li>
          <li>Supporting photographs provided.</li>
          <li>Issue verified by our Quality Team.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Non-Returnable Products</h2>
        <ul>
          <li>Opened or consumed food products.</li>
          <li>Fresh fruits and vegetables.</li>
          <li>Dairy and chilled products.</li>
          <li>Frozen products.</li>
          <li>Products marked non-returnable.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>4. Refund Process</h2>
        <p>Approved refunds are issued only to the original payment method.</p>
        <ul>
          <li>UPI: 2–5 business days.</li>
          <li>Debit/Credit Cards: 5–7 business days.</li>
          <li>Net Banking: 5–7 business days.</li>
          <li>Bank processing timelines may vary.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>5. Replacement Policy</h2>
        <p>
          Depending on product availability and investigation results we may:
        </p>
        <ul>
          <li>Replace the product.</li>
          <li>Issue store credit.</li>
          <li>Issue a partial refund.</li>
          <li>Issue a full refund.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>6. Customer Cancellation</h2>
        <p>
          Orders may be cancelled before processing or dispatch. Once packed,
          shipped or handed over to the courier partner, cancellation may not be
          possible.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Seller Cancellation</h2>
        <p>Captain&apos;s Choice may cancel an order due to:</p>
        <ul>
          <li>Product unavailable.</li>
          <li>Pricing error.</li>
          <li>Payment verification failure.</li>
          <li>Fraud detection.</li>
          <li>Non-serviceable delivery location.</li>
        </ul>
        <p>
          Any prepaid amount will be refunded to the original payment method.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Refund Not Applicable</h2>
        <ul>
          <li>Products consumed or used.</li>
          <li>Requests made after 24 hours.</li>
          <li>Taste preferences.</li>
          <li>Incorrect address provided by customer.</li>
          <li>Customer unavailable for delivery.</li>
          <li>False or fraudulent claims.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>9. Quality Inspection</h2>
        <p>
          Returned products are inspected by our quality team before approving
          any refund, replacement or store credit.
        </p>
      </section>

      <section className="policy-section">
        <h2>10. Delays Beyond Our Control</h2>
        <p>
          Refund processing may be delayed due to banking holidays, payment
          gateway maintenance, natural disasters or other unforeseen events.
        </p>
      </section>

      <section className="policy-section">
        <h2>11. Contact Us</h2>
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

export default RefundPolicy;
