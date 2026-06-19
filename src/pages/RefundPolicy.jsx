import React from "react";
import "../styles/PolicyPages.css";

function RefundPolicy() {
  return (
    <div className="policy-page">
      <h1>Refund & Return Policy</h1>

      <p className="policy-intro">
        At Captain&apos;s Choice, we are committed to delivering fresh,
        high-quality products and ensuring a reliable purchasing experience for
        our customers. This Refund & Return Policy outlines the conditions under
        which returns, replacements, cancellations, and refunds may be
        processed.
      </p>

      <p className="last-updated">Last Updated: June 2026</p>

      <section className="policy-section">
        <h2>1. Returns</h2>

        <p>
          Due to the nature of food products and perishable goods, returns are
          generally not accepted once products have been delivered.
        </p>

        <p>
          However, return or replacement requests may be considered under the
          following circumstances:
        </p>

        <ul>
          <li>Products received in a damaged condition.</li>
          <li>Incorrect products delivered.</li>
          <li>Products with verified quality concerns.</li>
          <li>Missing items in an order.</li>
        </ul>

        <p>
          Any issue must be reported within <strong>24 hours</strong> of
          delivery with supporting photographs and order details.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. Refunds</h2>

        <p>
          Once a refund request is reviewed and approved, the refund will be
          processed using the original payment method.
        </p>

        <ul>
          <li>Approved refunds are processed within 5–10 business days.</li>
          <li>
            Replacement products may be offered instead of a refund where
            appropriate.
          </li>
          <li>
            Refund timelines may vary depending on your payment provider or
            bank.
          </li>
        </ul>

        <p>
          Captain&apos;s Choice reserves the right to investigate claims before
          approving refunds or replacements.
        </p>
      </section>

      <section className="policy-section">
        <h2>3. Cases Not Eligible for Refund</h2>

        <ul>
          <li>Products that have been opened, consumed, or used.</li>
          <li>Requests submitted after the reporting period.</li>
          <li>Dissatisfaction based solely on personal taste preferences.</li>
          <li>
            Delivery failures caused by incorrect address details provided by
            the customer.
          </li>
          <li>
            Orders that could not be delivered due to customer unavailability.
          </li>
          <li>
            Minor variations in product packaging, labeling, or appearance.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>4. Non-Returnable Products</h2>

        <p>
          For food safety and hygiene reasons, the following products are
          generally non-returnable:
        </p>

        <ul>
          <li>Fresh fruits and vegetables.</li>
          <li>Dairy and chilled products.</li>
          <li>Frozen products.</li>
          <li>Opened packaged food items.</li>
          <li>Products marked as non-returnable.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>5. Reporting an Issue</h2>

        <p>
          To report a damaged, missing, incorrect, or defective product, please
          contact our support team with:
        </p>

        <ul>
          <li>Order ID or Invoice Number</li>
          <li>Registered Contact Number</li>
          <li>Description of the issue</li>
          <li>Photographs showing the concern</li>
        </ul>

        <p>
          Our team will review the details and provide a resolution as quickly
          as possible.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Replacement Policy</h2>

        <p>Where replacement is approved, Captain&apos;s Choice may:</p>

        <ul>
          <li>Arrange a replacement delivery.</li>
          <li>Issue store credit.</li>
          <li>Provide a full or partial refund.</li>
        </ul>

        <p>
          The resolution method will depend on product availability and the
          nature of the issue.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Order Cancellation Policy</h2>

        <ul>
          <li>
            Orders may be canceled before they are processed or dispatched.
          </li>
          <li>
            Once an order has been packed, shipped, or handed over for delivery,
            cancellation requests may not be accepted.
          </li>
          <li>
            Approved cancellation refunds are processed within 5–7 business
            days.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>8. Contact Information</h2>

        <div className="contact-box">
          <h3>Captain&apos;s Choice</h3>
          <p>India&apos;s Trusted B2B Food Supply Platform</p>

          <p>📞 +91 808 080 8080</p>
          <p>📍 Bengaluru, Karnataka, India</p>
          <p>📧 hello@captainschoice.in</p>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicy;
