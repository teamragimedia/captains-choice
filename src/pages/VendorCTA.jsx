import React from "react";
import { FaCheckCircle, FaStore } from "react-icons/fa";
import "../styles/vendorCTA.css";
import vendorImg from "../assets/vendor.png"; // your image
import checkIcon from "../assets/check.png";

function VendorCTA() {
  return (
    <section className="container-fluid vendor-section">
      <div className="vendor-container">
        {/* LEFT CONTENT */}
        <div className="vendor-left">
          <h2>Are You a Food Vendor?</h2>

          <p className="subtitle">
            Join 200+ verified suppliers on our platform. Reach 500+ restaurants
            and expand your business.
          </p>

          <ul className="vendor-points">
            <li>
              <img src={checkIcon} alt="check" />
              Dedicated account manager
            </li>
            <li>
              <img src={checkIcon} alt="check" />
              Quick payments – T+7 settlement
            </li>
          </ul>

          <button className="vendor-btn">
            <FaStore />
            Become a Vendor
          </button>

          <p className="note">Become a Vendor in 24 hours</p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="vendor-right">
          <img src={vendorImg} alt="vendor" />
        </div>
      </div>
    </section>
  );
}

export default VendorCTA;
