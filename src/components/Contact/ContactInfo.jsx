import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import "./ContactInfo.css";

const contactData = [
  {
    icon: <FaPhoneAlt />,
    title: "Call Us",
    text1: "+91 78993 70617",
    text2: "Mon - Sat | 9:00 AM - 7:00 PM",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Us",
    text1: "Eightcap1986@gmail.com",
    text2: "sales@captainschoice.in",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Visit Us",
    text1:
      "Captain's Choice 1st floor,No 273 30, 234 249 281 Y.V Annaiah Road, Yelachenahalli, JP Nagar Bengaluru 560078",
    text2: "Bangalore, Karnataka",
  },
  {
    icon: <FaClock />,
    title: "Working Hours",
    text1: "Monday - Saturday",
    text2: "9:00 AM - 7:00 PM",
  },
];

const ContactInfo = () => {
  return (
    <section className="contact-info">
      <div className="container">
        <div className="section-header">
          <span>GET IN TOUCH</span>
          <h2>We're Always Ready To Help</h2>
          <p>
            Reach out to our team for product inquiries, support, partnerships,
            and business opportunities.
          </p>
        </div>

        <div className="info-grid">
          {contactData.map((item, index) => (
            <div className="info-card" key={index}>
              <div className="info-icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.text1}</p>
              <span>{item.text2}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
