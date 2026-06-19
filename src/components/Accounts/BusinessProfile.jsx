import React, { useEffect, useState } from "react";

import "../../styles/businessProfile.css";
import API from "../../api";
import {
  FiCheckCircle,
  FiClock,
  FiUser,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";

const BusinessProfile = () => {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    business_name: "",
    name: "",
    email: "",
    phone: "",
    gst: "",
    fssai: "",
    business_type: "",
    monthly_volume: "",
  });

  const customerId = localStorage.getItem("customerId");

  /* ================= GET USER ================= */
  useEffect(() => {
    API.get("/user/me", {
      headers: { customerId },
    })
      .then((res) => {
        setUser(res.data);

        setForm({
          business_name: res.data.business_name || "",
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gst: res.data.gst || "",
          fssai: res.data.fssai || "",
          business_type: res.data.business_type || "",
          monthly_volume: res.data.monthly_volume || "",
        });
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p>Loading...</p>;

  const isFirstTime = !user.is_profile_submitted;
  const isUnderReview = user.is_profile_submitted && !user.is_profile_approved;
  const isApproved = user.is_profile_approved;

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    // 🔥 VALIDATION
    for (let key in form) {
      if (!form[key] || form[key].toString().trim() === "") {
        alert(`${key.replace("_", " ")} is required`);
        return;
      }
    }

    // 🔥 API CALL
    API.post("/user/submit-profile", form, {
      headers: { customerId },
    })
      .then(() => {
        alert("Submitted!");

        setUser({
          ...user,
          is_profile_submitted: 1,
          is_profile_approved: 0,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Submission failed");
      });
  };

  /* ================= ICON MAP ================= */
  const icons = {
    business_name: <FiBriefcase />,
    name: <FiUser />,
    email: <FiMail />,
    phone: <FiPhone />,
    gst: <FiFileText />,
    fssai: <FiFileText />,
    business_type: <FiBriefcase />,
    monthly_volume: <FiTrendingUp />,
  };

  return (
    <div className="bp-container">
      <h2 className="bp-title">Business Profile</h2>

      {/* STATUS */}
      {isUnderReview && (
        <div className="bp-status review">
          <FiClock /> <span>Under Review</span>
        </div>
      )}

      {isApproved && (
        <div className="bp-status approved">
          <FiCheckCircle /> <span>Approved</span>
        </div>
      )}

      {/* FORM */}
      <div className="bp-grid">
        {Object.keys(form).map((key) => (
          <div key={key} className="bp-field">
            <label>
              {icons[key]} {key.replace("_", " ").toUpperCase()}
            </label>

            <input
              value={form[key]}
              disabled={!isFirstTime}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className={!isFirstTime ? "disabled" : ""}
            />
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="bp-btn">
        {isFirstTime && (
          <button className="primary" onClick={handleSubmit}>
            Submit Profile
          </button>
        )}

        {isUnderReview && (
          <button className="review-btn" disabled>
            Under Review
          </button>
        )}

        {isApproved && (
          <button className="approved-btn" disabled>
            Approved ✓
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
