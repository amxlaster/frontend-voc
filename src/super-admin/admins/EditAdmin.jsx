// frontend/src/super-admin/admins/EditAdmin.jsx
import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditAdmin.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function EditAdmin() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: ""
  });

  useEffect(() => {
    API.get(`/admins/${id}`)
      .then((res) => {
        const u = res.data.admin;
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          dob: u.dob || "",
          gender: u.gender || "",
          password: ""
        });
      })
      .catch(() => {
        alert("Admin not found");

        // ⭐ FIXED ROUTE
        nav("/super-admin/admin");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      dob: form.dob,
      gender: form.gender
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      await API.put(`/admins/${id}`, payload);
      alert("Updated");

      // ⭐ FIXED ROUTE
      nav("/super-admin/admin");

    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="sa-edit-user-root">Loading…</div>;

  return (
    <Layout>
      <div className="sa-edit-user-root">
        <PageHeader title="Edit Admin" />

        <div className="sa-edit-user-card">
          <form className="sa-edit-user-form-grid" onSubmit={submit}>

            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              />
            </label>

            <label>
              <span>Email (read-only)</span>
              <input value={form.email} readOnly />
            </label>

            <label>
              <span>Phone</span>
              <input
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              />
            </label>

            <label>
              <span>Date of Birth</span>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm((s) => ({ ...s, dob: e.target.value }))}
              />
            </label>

            <label>
              <span>Gender</span>
              <select
                value={form.gender}
                onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              <span>New Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                placeholder="Leave empty to keep current"
              />
            </label>

            <div className="sa-edit-user-actions">
              <button
                className="sa-edit-user-btn sa-edit-user-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                className="sa-edit-user-btn sa-edit-user-outline"
                onClick={() => nav("/super-admin/admin")}
                disabled={saving}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}
