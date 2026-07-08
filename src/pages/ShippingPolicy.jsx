import React from "react";
import "../styles/PolicyPages.css";

function ShippingPolicy() {
  return (
    <div className="policy-page">
      <h1>Shipping Policy</h1>

      <p className="policy-intro">
        At Captain&apos;s Choice, we are committed to delivering fresh,
        high-quality food products safely and on time. This Shipping Policy
        explains how orders are processed, shipped, delivered, and handled in
        case of delays or delivery-related issues.
      </p>

      <p className="last-updated">Last Updated: July 2026</p>

      {/* Shipping Coverage */}

      <section className="policy-section">
        <h2>1. Shipping Coverage</h2>

        <p>
          Captain&apos;s Choice currently delivers across serviceable locations
          within India.
        </p>

        <ul>
          <li>
            Delivery availability depends on the customer's PIN code and service
            area.
          </li>

          <li>Some remote or restricted locations may not be serviceable.</li>

          <li>
            If an order cannot be delivered due to service limitations, any
            prepaid amount collected will be refunded to the original payment
            method.
          </li>
        </ul>
      </section>

      {/* Processing */}

      <section className="policy-section">
        <h2>2. Order Processing</h2>

        <p>
          Orders are processed only after successful payment authorization for
          prepaid orders or confirmation of eligible Cash on Delivery orders.
        </p>

        <ul>
          <li>Orders are processed within 24–48 business hours.</li>

          <li>
            Orders received on Sundays or public holidays will be processed on
            the next working day.
          </li>

          <li>
            Large quantity or bulk orders may require additional processing
            time.
          </li>
        </ul>
      </section>

      {/* Dispatch */}

      <section className="policy-section">
        <h2>3. Dispatch Timeline</h2>

        <p>
          Once an order has been processed, it is dispatched within 24–48
          business hours through our authorized logistics partners.
        </p>
      </section>

      {/* Delivery */}

      <section className="policy-section">
        <h2>4. Estimated Delivery Time</h2>

        <p>
          Delivery timelines depend on your location and courier availability.
        </p>

        <ul>
          <li>Metro Cities: 1–3 Business Days</li>

          <li>Major Cities: 2–5 Business Days</li>

          <li>Other Serviceable Areas: 3–7 Business Days</li>
        </ul>

        <p>
          These are estimated delivery timelines and may vary depending on
          weather conditions, courier operations, natural disasters, strikes,
          government restrictions, festivals, or other unforeseen circumstances.
        </p>
      </section>

      {/* Shipping Charges */}

      <section className="policy-section">
        <h2>5. Shipping Charges</h2>

        <p>Shipping charges, if applicable, are calculated based on:</p>

        <ul>
          <li>Delivery location</li>

          <li>Order value</li>

          <li>Product weight or volume</li>

          <li>Running promotional offers</li>
        </ul>

        <p>
          The applicable shipping charge will be displayed during checkout
          before payment confirmation.
        </p>
      </section>

      {/* Courier */}

      <section className="policy-section">
        <h2>6. Shipping Partners</h2>

        <p>
          Orders are shipped through trusted logistics and courier partners
          depending on service availability. Courier partners may include
          Delhivery, Blue Dart, DTDC, XpressBees, India Post, Shiprocket, or
          other authorized logistics providers.
        </p>
      </section>

      {/* Tracking */}

      <section className="policy-section">
        <h2>7. Order Tracking</h2>

        <p>
          Once your order has been dispatched, tracking information will be
          shared via Email, SMS, WhatsApp, or through your registered account,
          wherever applicable.
        </p>

        <p>
          Customers may contact our support team if shipment tracking is not
          available or if there are delivery-related concerns.
        </p>
      </section>

      {/* Delivery Attempts */}

      <section className="policy-section">
        <h2>8. Delivery Attempts</h2>

        <ul>
          <li>
            Courier partners may attempt delivery more than once depending on
            their service policy.
          </li>

          <li>
            Customers are requested to ensure someone is available to receive
            the order.
          </li>

          <li>
            Incorrect addresses, invalid contact details, or customer
            unavailability may result in delayed or failed deliveries.
          </li>

          <li>
            Additional shipping charges may apply for re-delivery wherever
            applicable.
          </li>
        </ul>
      </section>

      {/* Failed Delivery */}

      <section className="policy-section">
        <h2>9. Failed Deliveries</h2>

        <p>
          Orders may be returned to Captain&apos;s Choice if delivery cannot be
          completed due to:
        </p>

        <ul>
          <li>Incorrect shipping address</li>

          <li>Incorrect contact number</li>

          <li>Customer unavailable after delivery attempts</li>

          <li>Order refused at delivery</li>
        </ul>

        <p>
          Refunds or re-shipping of returned orders will be handled according to
          our Refund & Cancellation Policy.
        </p>
      </section>

      {/* Damaged */}

      <section className="policy-section">
        <h2>10. Damaged, Missing or Incorrect Products</h2>

        <p>
          If your order is damaged, incomplete, or contains incorrect items,
          please notify us within 24 hours of delivery.
        </p>

        <ul>
          <li>Provide your Order ID.</li>

          <li>Share photographs of the package and products.</li>

          <li>
            Our support team will investigate and provide an appropriate
            resolution including replacement, store credit, or refund wherever
            applicable.
          </li>
        </ul>
      </section>

      {/* Lost */}

      <section className="policy-section">
        <h2>11. Lost Shipments</h2>

        <p>
          If a shipment is confirmed as lost while in transit by the courier
          partner, Captain&apos;s Choice will investigate the matter and, where
          appropriate, provide a replacement or process a refund as per our
          Refund Policy.
        </p>
      </section>

      {/* Force Majeure */}

      <section className="policy-section">
        <h2>12. Delays Beyond Our Control</h2>

        <p>
          Delivery timelines may be affected by circumstances beyond our
          reasonable control including:
        </p>

        <ul>
          <li>Heavy rainfall</li>

          <li>Floods</li>

          <li>Natural disasters</li>

          <li>Government restrictions</li>

          <li>Public holidays</li>

          <li>Transport disruptions</li>

          <li>Labour strikes</li>
        </ul>

        <p>
          Captain&apos;s Choice shall not be held responsible for delays arising
          from such events.
        </p>
      </section>

      {/* International */}

      <section className="policy-section">
        <h2>13. International Shipping</h2>

        <p>
          Captain&apos;s Choice currently delivers only within India.
          International shipping is not available at this time.
        </p>
      </section>

      {/* Contact */}

      <section className="policy-section">
        <h2>14. Contact Information</h2>

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
            <strong>Customer Support:</strong>
            <br />
            Monday – Saturday
            <br />
            9:00 AM – 6:00 PM
          </p>
        </div>
      </section>
    </div>
  );
}

export default ShippingPolicy;
