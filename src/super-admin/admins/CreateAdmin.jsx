// frontend/src/super-admin/admins/CreateAdmin.jsx
import { useState } from "react";
import API from "../../lib/api";
import { useNavigate } from "react-router-dom";
import "./CreateAdmin.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function CreateAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: ""
  });

  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const update = (key, value) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return alert("Email and password are required");

    if (form.password.length < 8)
      return alert("Password must be at least 8 characters");

    setBusy(true);

    try {
      await API.post("/admins", form); // Protected API
      alert("Admin created successfully");

      // ⭐ FIXED ROUTE
      nav("/super-admin/admin");

    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <div className="sa-create-admin-root sa-create-admin-centered">
        <div className="sa-create-admin-card">

          <PageHeader title="Create Admin" />

          <div className="sa-create-admin-body">
            <form
              className="sa-create-admin-form-grid sa-create-admin-form-2"
              onSubmit={submit}
              autoComplete="off"
            >

              <label className="sa-create-admin-form-group">
                <span className="sa-create-admin-label">Name</span>
                <input
                  className="sa-create-admin-input"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="sa-create-admin-form-group">
                <span className="sa-create-admin-label">Email</span>
                <input
                  className="sa-create-admin-input"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  type="email"
                  placeholder="admin@example.com"
                  required
                />
              </label>

              <label className="sa-create-admin-form-group">
                <span className="sa-create-admin-label">Phone Number</span>
                <input
                  className="sa-create-admin-input"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="9876543210"
                  required
                />
              </label>

              <label className="sa-create-admin-form-group">
                <span className="sa-create-admin-label">Date of Birth</span>
                <input
                  type="date"
                  className="sa-create-admin-input"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  required
                />
              </label>

              <label className="sa-create-admin-form-group">
                <span className="sa-create-admin-label">Gender</span>
                <select
                  className="sa-create-admin-input"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="sa-create-admin-form-group sa-create-admin-full">
                <span className="sa-create-admin-label">Password</span>
                <input
                  className="sa-create-admin-input"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="At least 8 characters"
                  type="password"
                  required
                />
              </label>

              <div className="sa-create-admin-actions">
                <button
                  className="sa-create-admin-btn sa-create-admin-primary sa-create-admin-large"
                  type="submit"
                  disabled={busy}
                >
                  {busy ? "Creating..." : "Create Admin"}
                </button>

                <button
                  type="button"
                  className="sa-create-admin-btn sa-create-admin-outline sa-create-admin-large"
                  onClick={() => nav("/super-admin/admin")}
                  disabled={busy}
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
