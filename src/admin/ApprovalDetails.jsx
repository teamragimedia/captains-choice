import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Admin.css";
import API from "../api";

const ApprovalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  // 🔥 FETCH USER
  useEffect(() => {
    API.get(`/admin/user/${id}`)
      .then((res) => {
        if (!res.data || res.data.message === "User not found") {
          toast.error("User no longer exists ❌");
          navigate("/admin/approvals");
          return;
        }

        const u = res.data;

        // 🔥 FORCE CORRECT STATUS
        let status = "pending";

        if (u.is_profile_approved === 1) {
          status = "approved";
        } else if (u.is_profile_approved === -1) {
          status = "rejected";
        }

        setUser({
          ...u,
          status, // ✅ IMPORTANT
        });
      })
      .catch(() => {
        toast.error("User deleted or not found ❌");
        navigate("/admin/approvals");
      });
  }, [id, navigate]);

  // 🔥 APPROVE
  const approve = () => {
    API.put(`/admin/approve/${id}`).then(() => {
      toast.success("Approved successfully");

      setTimeout(() => {
        navigate("/admin/approvals");
      }, 1000);
    });
  };

  // 🔥 REJECT
  const reject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter rejection reason");
      return;
    }

    API.put(`/admin/reject/${id}`, {
      reason: rejectReason,
    })
      .then(() => {
        setUser({
          ...user,
          status: "rejected",
          rejection_reason: rejectReason,
        });
        setShowReject(false);
        toast.error("User Rejected ❌");
      })
      .catch(() => {
        toast.error("Reject failed");
      });
  };

  if (!user) return <div className="approval-container">Loading...</div>;

  const status = (user.status || "pending").toLowerCase();

  return (
    <div className="approval-container">
      {/* 🔹 Breadcrumb */}
      <p className="breadcrumb12">
        Approvals / <span>{user.business_name}</span>
      </p>

      <div className="approval-card">
        <h2>{user.business_name}</h2>

        {/* 🔥 STATUS */}
        <div className={`status-banner ${user.status}`}>
          {user.status === "pending" && "⏳ Pending"}
          {user.status === "approved" && "✅ Approved"}
          {user.status === "rejected" &&
            `❌ Rejected - ${user.rejection_reason || ""}`}
        </div>

        {/* 🔹 FORM GRID */}
        <div className="approval-grid">
          <div className="field">
            <label>🏢 BUSINESS NAME</label>
            <input value={user.business_name || ""} disabled />
          </div>

          <div className="field">
            <label>👤 NAME</label>
            <input value={user.name || ""} disabled />
          </div>

          <div className="field">
            <label>📧 EMAIL</label>
            <input value={user.email || ""} disabled />
          </div>

          <div className="field">
            <label>📱 PHONE</label>
            <input value={user.phone || ""} disabled />
          </div>

          <div className="field">
            <label>🧾 GST</label>
            <input value={user.gst || ""} disabled />
          </div>

          <div className="field">
            <label>📜 FSSAI</label>
            <input value={user.fssai || ""} disabled />
          </div>

          <div className="field">
            <label>🏬 BUSINESS TYPE</label>
            <input value={user.business_type || ""} disabled />
          </div>

          <div className="field">
            <label>📊 MONTHLY VOLUME</label>
            <input value={user.monthly_volume || ""} disabled />
          </div>
        </div>

        {/* 🔥 ACTION BUTTONS (ONLY IF PENDING) */}
        {status === "pending" && (
          <div className="action-row">
            <button className="approve-btn" onClick={approve}>
              ✓ Approve
            </button>

            <button className="reject-btn" onClick={() => setShowReject(true)}>
              ✕ Reject
            </button>
          </div>
        )}
      </div>

      {/* 🔥 REJECT MODAL */}
      {showReject && (
        <div className="modal-overlay">
          <div className="reject-modal">
            <h3>Reject Request</h3>
            <p className="modal-subtext">
              Please provide a reason for rejecting this business profile
              approval.
            </p>

            <textarea
              placeholder="Enter rejection message..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowReject(false)}
              >
                Cancel
              </button>

              <button className="reject-btn" onClick={reject}>
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDetails;
