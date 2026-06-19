import React from "react";
import "../styles/PolicyPages.css";

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <h1>Shipping Policy</h1>

      <p className="policy-intro">
        At Captain&apos;s Choice, we are committed to delivering fresh,
        high-quality products quickly, safely, and efficiently. This Shipping
        Policy explains our order processing, delivery timelines, shipping
        practices, and customer responsibilities.
      </p>

      <p className="last-updated">Last Updated: June 2026</p>

      <section className="policy-section">
        <h2>1. Shipping Coverage</h2>

        <p>
          Captain&apos;s Choice currently delivers across selected cities and
          serviceable regions in India through our logistics network and trusted
          delivery partners.
        </p>

        <ul>
          <li>
            Delivery availability depends on your location and service area.
          </li>
          <li>
            Certain remote or restricted locations may not be eligible for
            delivery.
          </li>
          <li>
            If a location is not serviceable, prepaid amounts (if any) will be
            refunded.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>2. Order Processing Time</h2>

        <p>
          Orders are generally processed within 1–2 business days after order
          confirmation.
        </p>

        <ul>
          <li>
            Orders placed on weekends or public holidays may be processed on the
            next working day.
          </li>
          <li>
            Bulk or special procurement orders may require additional processing
            time.
          </li>
          <li>
            Customers may receive order updates through email, SMS, or phone
            communication.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Estimated Delivery Time</h2>

        <p>
          Delivery timelines vary depending on product availability, order size,
          and delivery location.
        </p>

        <ul>
          <li>Metro Cities: 1–3 business days</li>
          <li>Major Cities: 2–5 business days</li>
          <li>Other Serviceable Areas: 3–7 business days</li>
        </ul>

        <p>
          Delivery schedules are estimates only and may be affected by weather
          conditions, traffic, public holidays, operational disruptions, or
          other unforeseen circumstances.
        </p>
      </section>

      <section className="policy-section">
        <h2>4. Shipping Charges</h2>

        <p>Shipping charges may vary depending on:</p>

        <ul>
          <li>Order value</li>
          <li>Delivery location</li>
          <li>Weight and volume of products</li>
          <li>Promotional offers and campaigns</li>
        </ul>

        <p>
          Any applicable delivery charges will be displayed during checkout
          before payment confirmation.
        </p>
      </section>

      <section className="policy-section">
        <h2>5. Order Tracking</h2>

        <p>
          Customers may receive tracking information or delivery updates via
          email, SMS, phone call, or WhatsApp where applicable. If you have
          questions regarding your shipment status, our customer support team
          will be happy to assist.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Delivery Attempts</h2>

        <ul>
          <li>
            Our delivery team may attempt delivery more than once when feasible.
          </li>
          <li>
            Customers are responsible for ensuring availability at the delivery
            address.
          </li>
          <li>
            Additional delivery charges may apply for repeated delivery
            attempts.
          </li>
          <li>
            Captain&apos;s Choice is not responsible for failed deliveries
            caused by incorrect addresses, inaccurate contact details, or
            customer unavailability.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>7. Damaged, Missing, or Incorrect Items</h2>

        <p>
          If your order arrives damaged, incomplete, or contains incorrect
          products:
        </p>

        <ul>
          <li>Notify us within 24 hours of delivery.</li>
          <li>Provide your Order ID or Invoice Number.</li>
          <li>Share photographs showing the issue wherever applicable.</li>
        </ul>

        <p>
          Our team will investigate and provide a suitable resolution, including
          replacement, credit, or refund where applicable.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Delivery Restrictions</h2>

        <p>
          Certain products may have delivery restrictions based on freshness
          requirements, storage conditions, local regulations, or service area
          limitations. Captain&apos;s Choice reserves the right to restrict or
          cancel orders that cannot be fulfilled safely or efficiently.
        </p>
      </section>

      <section className="policy-section">
        <h2>9. Contact Information</h2>

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

export default ShippingPolicy;
