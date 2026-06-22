import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/LoginPopup.css";
import logo from "../assets/logo1.png";
import groceryImage from "../assets/grocery.png";
import { useNavigate } from "react-router-dom";

import API from "../api";

const LoginPopup = ({ isOpen, onClose }) => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");

  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  // ================= RECAPTCHA =================

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        },
      );
    }
  };

  // ================= SEND OTP =================

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      alert("Enter valid number");
      return;
    }

    try {
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        appVerifier,
      );

      window.confirmationResult = confirmation;

      alert("OTP sent 📱");

      setStep(2);
    } catch (err) {
      console.error(err);

      alert("Failed to send OTP");
    }
  };

  // ================= VERIFY OTP =================

  const handleVerifyOtp = async () => {
    try {
      // Firebase verification
      await window.confirmationResult.confirm(otp);

      // Backend login
      const res = await API.post("/verify-otp", {
        phone,
      });

      console.log("FULL RESPONSE:", res.data);

      // SAVE USER DATA

      localStorage.setItem("customerId", res.data.customerId);

      localStorage.setItem("token", res.data.token);

      console.log("TOKEN SAVED:", res.data.token);

      // update auth context

      login(res.data.token, res.data.customerId);

      alert("Login successful ✅");

      console.log("isNewUser:", res.data?.isNewUser);

      if (res.data?.isNewUser) {
        navigate("/account");
      } else {
        navigate("/");
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* LEFT */}

        <div className="popup-left">
          <div className="logo">
            <img src={logo} alt="logo" className="logo-img" />
          </div>

          <h3>Welcome to Captain’s Choice! Let’s Get Started!</h3>

          {step === 1 && (
            <>
              <label>Enter Phone Number</label>

              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <button className="continue-btn" onClick={handleSendOtp}>
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label>Enter OTP</label>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button className="continue-btn" onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          <p className="terms">
            By continuing, you agree to our
            <span> Terms & Privacy Policy</span>
          </p>

          <div id="recaptcha-container"></div>
        </div>

        {/* RIGHT */}

        <div className="popup-right">
          <img src={groceryImage} alt="groceries" />
        </div>

        <span className="close-btn" onClick={onClose}>
          ×
        </span>
      </div>
    </div>
  );
};

export default LoginPopup;
