import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaBuilding,
  FaPen,
} from "react-icons/fa";
import "./ContactForm.css";

const ContactForm = () => {
  return (
    <section className="contact-form-section">
      <div className="container">
        <div className="contact-wrapper">
          {/* Left Form */}
          <div className="contact-form-card">
            <span className="section-tag">SEND US A MESSAGE</span>

            <h2>Let's Start a Conversation</h2>

            <p>
              Have a question, partnership inquiry, or need support? Fill out
              the form below and our team will get back to you.
            </p>

            <form className="contact-form">
              <div className="form-grid">
                <div className="input-group">
                  <FaUser />
                  <input type="text" placeholder="Your Name" />
                </div>

                <div className="input-group">
                  <FaEnvelope />
                  <input type="email" placeholder="Email Address" />
                </div>

                <div className="input-group">
                  <FaPhoneAlt />
                  <input type="tel" placeholder="Phone Number" />
                </div>

                <div className="input-group">
                  <FaBuilding />
                  <input type="text" placeholder="Company Name" />
                </div>
              </div>

              <div className="input-group full-width">
                <FaPen />
                <input type="text" placeholder="Subject" />
              </div>

              <textarea
                placeholder="Write your message here..."
                rows="6"
              ></textarea>

              <button type="submit">Send Message</button>
            </form>
          </div>

          {/* Right Map */}
          <div className="map-card">
            <div className="map-header">
              <h3>Visit Our Office</h3>
              <p>Find us easily using the map below.</p>
            </div>

            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62228.27768606887!2d77.55!3d12.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9f6f8a5%3A0x5770f4a5f5cbb4f!2sBangalore!5e0!3m2!1sen!2sin!4v1710000000000"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="office-info">
              <div className="office-item">
                <h4>Head Office</h4>
                <p>
                  Captain's Choice
                  <br />
                  Bangalore, Karnataka
                </p>
              </div>

              <div className="office-item">
                <h4>Email</h4>
                <p>support@captainschoice.in</p>
              </div>

              <div className="office-item">
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
