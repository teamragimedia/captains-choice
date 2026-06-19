import React from "react";
import "./ContactHero.css";
import bannerImage from "../../assets/banner3.png";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaHeadset,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

const ContactHero = () => {
  return (
    <section className="contact-hero">
      <div
        className="contact-hero-bg"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="contact-overlay"></div>

        <div className="contact-container">
          <div className="contact-content">
            <div className="hero-badge">
              <FaHeadset />
              <span>Captain's Choice Support Team</span>
            </div>

            <h1>Contact Us</h1>

            <p>
              We're here to help your business grow. Get in touch with our team
              for orders, partnerships, support, product inquiries, and vendor
              registration.
            </p>
            {/* 
            <div className="hero-buttons">
              <a href="tel:+919999999999" className="btn-primary">
                <FaPhoneAlt />
                <span>Call Us</span>
              </a>

              <a
                href="mailto:support@captainschoice.in"
                className="btn-secondary"
              >
                <FaEnvelope />
                <span>Email Us</span>
              </a>
            </div> */}

            <div className="hero-features">
              <div className="feature">
                <div className="feature-icon">
                  <FaClock />
                </div>
                <div>
                  <h4>Fast Response</h4>
                  <span>Within business hours</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <FaHeadset />
                </div>
                <div>
                  <h4>Expert Support</h4>
                  <span>Dedicated assistance</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <FaShieldAlt />
                </div>
                <div>
                  <h4>Reliable Solutions</h4>
                  <span>Trusted by businesses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg
          className="hero-wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
        >
          <path
            fill="#ffffff"
            d="M0,96L80,90.7C160,85,320,75,480,74.7C640,75,800,85,960,90.7C1120,96,1280,96,1360,96L1440,96L1440,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default ContactHero;
