import React, { useState } from "react";
import API from "../../../../lib/api";
import "./StudentChangePassword.css";

export default function StudentChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password & Confirm password must be same");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/students/change-password",
        { currentPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <h2 className="change-password-title">Change Password</h2>

        <form className="change-password-form" onSubmit={submit}>

          {/* CURRENT PASSWORD */}
          <div className="cp-field">
            <input
              className="cp-input"
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <span
              className="cp-eye"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? "👁️" : "🙈"}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <div className="cp-field">
            <input
              className="cp-input"
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="cp-eye"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? "👁️" : "🙈"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="cp-field">
            <input
              className="cp-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="cp-eye"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "👁️" : "🙈"}
            </span>
          </div>

          <button className="cp-submit" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
