import React from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/footerCTA.css";

import logo from "../assets/logo.png";
import basket from "../assets/basket.png";

function FooterCTA() {
  return (
    <section className="footer-cta">
      {/* TOP CTA */}
      <div className="cta-top">
        <h2>Ready to Transform Your Supply Chain?</h2>
        <p>
          Join thousands of professional kitchens that trust Captain’s Choice
          for their sourcing needs
        </p>

        <button className="cta-btn">Start Ordering Now</button>

        <span className="cta-note">
          No credit card required. Get started in minutes.
        </span>
      </div>

      {/* FOOTER CONTENT */}
      <div className="container footer-content">
        {/* LEFT */}
        <div className="footer-column brand">
          <img src={logo} alt="Captain's Choice" className="logo" />

          <div className="badges">
            <span>
              <FaCheckCircle /> FSSAI Certified
            </span>
            <span>
              <FaCheckCircle /> Quality Assured
            </span>
          </div>

          <p>
            India’s leading B2B food supply platform for restaurants, hotels,
            and catering businesses. Wholesale prices, reliable delivery, 1000+
            products.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/for-suppliers">For Suppliers</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>
              <Link to="/help-center">Help Center</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/refund-policy">Refund Policy</Link>
            </li>
            <li>
              <Link to="/shipping-policy">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/accessibility-statement">Accessibility Statement</Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4>Get in Touch</h4>
          <ul>
            <li>
              <FaEnvelope /> hello@captainschoice.in
            </li>
            <li>
              <FaPhoneAlt /> +91 808 080 8080
            </li>
            <li>
              <FaMapMarkerAlt /> Bengaluru, India
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM IMAGE */}
      <div className="footer-image">
        <img src={basket} alt="Basket" />
      </div>
    </section>
  );
}

export default FooterCTA;
