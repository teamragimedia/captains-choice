import React from "react";
import "../styles/AccessibilityStatement.css";

function AccessibilityStatement() {
  return (
    <div className="policy-container">
      <h1>Accessibility Statement</h1>

      <p className="policy-intro">
        At Captain's Choice, we are committed to ensuring that our website and
        digital services are accessible to everyone, including individuals with
        disabilities.
      </p>

      <p className="last-updated">Last Updated: July 2026</p>

      <section>
        <h2>1. Our Commitment</h2>
        <p>
          Captain's Choice strives to create an inclusive and accessible online
          experience for restaurants, hotels, caterers, cloud kitchens,
          suppliers, and all users who interact with our platform.
        </p>
      </section>

      <section>
        <h2>2. Accessibility Features</h2>

        <ul>
          <li>Clear and consistent navigation.</li>
          <li>Responsive layouts for desktop, tablet, and mobile devices.</li>
          <li>Readable fonts and appropriate color contrast.</li>
          <li>Keyboard-accessible navigation where possible.</li>
          <li>Alternative text descriptions for relevant images.</li>
          <li>Structured content with clear headings and sections.</li>
          <li>Compatibility with assistive technologies.</li>
        </ul>
      </section>

      <section>
        <h2>3. Ongoing Improvements</h2>
        <p>
          Accessibility is an ongoing process. We regularly review and improve
          our website to align with accessibility best practices and enhance
          usability for all users.
        </p>
      </section>

      <section>
        <h2>4. Feedback & Assistance</h2>

        <p>
          If you encounter any barriers or require assistance using our
          platform, please contact us.
        </p>

        <div className="contact-box">
          <h3>Contact Support</h3>
          <p>📞 +91 808 080 8080</p>
          <p>📧 hello@captainschoice.in</p>
          <p>📍 Bengaluru, Karnataka, India</p>
        </div>
      </section>

      <section>
        <h2>5. Third-Party Content</h2>
        <p>
          Some third-party services or external websites linked from our
          platform may not be fully accessible. We encourage partners to follow
          accessibility best practices.
        </p>
      </section>

      <section>
        <h2>6. Future Accessibility Goals</h2>
        <p>
          Captain's Choice remains committed to improving accessibility across
          all digital experiences and future platform updates.
        </p>
      </section>

      <section>
        <h2>7. Contact Information</h2>

        <div className="contact-box">
          <h3>Captain's Choice</h3>
          <p>India's Trusted B2B Food Supply Platform</p>
          <p>
            <strong>Phone:</strong> +91 7899370617
          </p>
          <p>
            <strong>Address:</strong>
            <br />
            1st floor,No 273 30, 234 249 281
            <br />
            Y.V Annaiah Road, Yelachenahalli,
            <br />
            JP Nagar Bengaluru 560078
          </p>
          <p>📧 Eightcap1986@gmail.com</p>
        </div>
      </section>
    </div>
  );
}

export default AccessibilityStatement;
