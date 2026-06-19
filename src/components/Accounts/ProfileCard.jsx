import React from "react";
import { FiCheckCircle, FiSettings } from "react-icons/fi";
import { AiOutlinePlusSquare } from "react-icons/ai";
import API from "../../api";

const ProfileCard = ({ user }) => {
  if (!user) return null;

  return (
    <div className="profile-card">
      {/* LEFT */}
      <div className="profile-left">
        <div className="avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "S"}
        </div>

        <div className="profile-info">
          <div className="title-row">
            <h2>{user.business_name}</h2>

            <span className="verified-badge">
              <FiCheckCircle size={14} />
              Verified Business
            </span>
          </div>

          <p>
            {user.name} • {user.email}
          </p>

          <span className="meta">
            GST: {user.gst} &nbsp;&nbsp; FSSAI: {user.fssai}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="profile-actions">
        <button className="btn-out">
          <FiSettings size={16} />
          Edit Profile
        </button>

        <button className="login-btn">
          <AiOutlinePlusSquare size={16} />
          Request a New Product
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
