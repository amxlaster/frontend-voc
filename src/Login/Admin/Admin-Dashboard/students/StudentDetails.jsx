// frontend/src/admin/students/StudentDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../../../lib/api";
import "./StudentDetails.css";

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadStudent() {
    try {
      setError("");
      setLoading(true);
      const res = await API.get(`/students/${id}`);
      setStudent(res.data.student);
    } catch (err) {
      console.error("Failed to load student:", err);
      setError("Failed to load student details.");
    } finally {
      setLoading(false);
    }
  }

  function fmtDate(d) {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this student? This action cannot be undone.")) return;
    try {
      setBusy(true);
      await API.delete(`/students/${id}`);
      // after delete, go back to list
      navigate(-1);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete student.");
    } finally {
      setBusy(false);
    }
  }

  function copyToClipboard(value, label) {
    if (!value) return;
    navigator.clipboard?.writeText(value).then(
      () => {
        // small feedback
        const prev = document.querySelector(".sd-copy-toast");
        if (prev) prev.remove();
        const t = document.createElement("div");
        t.className = "sd-copy-toast";
        t.textContent = `${label} copied`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1400);
      },
      () => {
        alert("Copy failed");
      }
    );
  }

  if (loading) return <div className="sd-root"><div className="sd-card"><p>Loading student details…</p></div></div>;
  if (error) return (
    <div className="sd-root">
      <div className="sd-card sd-error">
        <p>{error}</p>
        <div className="sd-actions-row">
          <button className="sd-btn sd-outline" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
  if (!student) return <div className="sd-root"><div className="sd-card"><p>No student found.</p></div></div>;

  return (
    <div className="sd-root">
      <div className="sd-card sd-card-wide">
        <div className="sd-top-row">
          <div>
            <h1 className="sd-title">{student.name || "—"}</h1>
            <div className="sd-sub">Student details</div>
          </div>

          <div className="sd-actions-row">
            <button className="sd-btn sd-outline" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>

        <div className="sd-body">
          <div className="sd-grid">

            <div className="sd-field">
              <div className="sd-label">Name</div>
              <div className="sd-value">{student.name || "—"}</div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Email</div>
              <div className="sd-value sd-inline">
                <a href={`mailto:${student.email}`} className="sd-link">{student.email || "—"}</a>
                {student.email && (
                  <button className="sd-copy" onClick={() => copyToClipboard(student.email, "Email")}>Copy</button>
                )}
              </div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Phone</div>
              <div className="sd-value sd-inline">
                <a href={`tel:${student.phone}`} className="sd-link">{student.phone || "—"}</a>
                {student.phone && (
                  <button className="sd-copy" onClick={() => copyToClipboard(student.phone, "Phone")}>Copy</button>
                )}
              </div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Date of birth</div>
              <div className="sd-value">{student.dob || "—"}</div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Gender</div>
              <div className="sd-value">{student.gender || "—"}</div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Class</div>
              <div className="sd-value">{student.className || "—"}</div>
            </div>

            <div className="sd-field">
              <div className="sd-label">Role</div>
              <div className="sd-value">{student.role || "student"}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
