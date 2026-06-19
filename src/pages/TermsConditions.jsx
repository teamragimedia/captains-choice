import React from "react";
import "../styles/PolicyPages.css";

function TermsConditions() {
  return (
    <div className="policy-page">
      <h1>Terms & Conditions</h1>

      <p className="policy-intro">
        Welcome to Captain&apos;s Choice. By accessing and using our website,
        you agree to the following Terms and Conditions. Please read them
        carefully before using our services or placing an order.
      </p>

      <p className="last-updated">Last Updated: June 2026</p>

      <section className="policy-section">
        <h2>1. General Information</h2>

        <p>
          This website is owned and operated by Captain&apos;s Choice.
          Throughout the site, the terms "we", "us", and "our" refer to
          Captain&apos;s Choice.
        </p>

        <p>
          By visiting our website or purchasing products through our platform,
          you agree to be bound by these Terms & Conditions and all applicable
          policies referenced herein.
        </p>
      </section>

      <section className="policy-section">
        <h2>2. Products & Services</h2>

        <p>
          Captain&apos;s Choice is a B2B food supply platform providing
          restaurants, hotels, caterers, cloud kitchens, and food businesses
          with access to fresh produce, dairy products, groceries, packaged
          foods, beverages, kitchen essentials, and other food service supplies.
        </p>

        <ul>
          <li>Product availability may vary based on stock levels.</li>
          <li>
            Product images are for representation purposes only and may differ
            from actual products.
          </li>
          <li>
            Specifications, packaging, and branding may vary depending on
            supplier availability.
          </li>
          <li>
            We strive to maintain high standards of quality and freshness.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>3. Orders & Payments</h2>

        <ul>
          <li>
            Orders may be placed through our website or authorized sales
            representatives.
          </li>
          <li>
            Prices displayed are subject to applicable taxes unless otherwise
            stated.
          </li>
          <li>Payments are processed through secure payment gateways.</li>
          <li>
            Captain&apos;s Choice reserves the right to cancel or modify any
            order due to stock shortages, pricing errors, or operational
            constraints.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>4. Shipping & Delivery</h2>

        <p>
          We deliver products through our logistics network and trusted delivery
          partners across designated service areas.
        </p>

        <ul>
          <li>Delivery timelines are estimates and may vary by location.</li>
          <li>
            Delays may occur due to weather conditions, public holidays, or
            logistics issues.
          </li>
          <li>
            Captain&apos;s Choice is not liable for delays caused by
            circumstances beyond its control.
          </li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>5. Returns & Refunds</h2>

        <p>
          Due to the nature of food and perishable products, returns are
          accepted only in the following cases:
        </p>

        <ul>
          <li>Damaged products received at delivery.</li>
          <li>Incorrect products supplied.</li>
          <li>Verified quality-related issues.</li>
        </ul>

        <p>
          Customers must report issues within the timeframe specified in our
          Refund Policy.
        </p>
      </section>

      <section className="policy-section">
        <h2>6. Limitation of Liability</h2>

        <p>
          Captain&apos;s Choice shall not be liable for any indirect,
          incidental, or consequential damages arising from the use of our
          products, website, or services.
        </p>
      </section>

      <section className="policy-section">
        <h2>7. Intellectual Property</h2>

        <p>
          All content on this website, including text, graphics, logos,
          trademarks, images, and design elements, is the property of
          Captain&apos;s Choice and protected under applicable intellectual
          property laws.
        </p>
      </section>

      <section className="policy-section">
        <h2>8. Governing Law & Jurisdiction</h2>

        <p>
          These Terms & Conditions are governed by the laws of India. Any
          disputes shall be subject to the exclusive jurisdiction of the courts
          of Bengaluru, Karnataka.
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

export default TermsConditions;
