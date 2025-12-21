// frontend/src/super-admin/users/EditUser.jsx
import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useNavigate, useParams } from "react-router-dom";
import "./EditUser.css";
import PageHeader from "../../components/PageHeader";
import Layout from "../../components/Layout";

export default function EditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
    password: "",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // ⭐ UPDATED API ROUTE (same pattern like /admins/:id)
    API.get(`/admins/${id}`)
      .then((res) => {
        if (!mounted) return;
        const u = res.data.admin;

        setForm({
          name: u.name || "",
          email: u.email || "",
          role: u.role || "admin",
          password: "",
        });
      })
      .catch(() => {
        alert("Failed to load user");
        nav("/super-admin/admin");   // ⭐ FIXED REDIRECT
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name: form.name,
        role: form.role,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      // ⭐ UPDATED API ROUTE
      await API.put(`/admins/${id}`, payload);

      alert("Saved");

      // ⭐ FIXED REDIRECT
      nav("/super-admin/admin");
    } catch (err) {
      alert(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sa-edit-user-root">
        <PageHeader title="Edit User" />
        <div className="sa-edit-user-card">
          <div className="sa-edit-user-body">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="sa-edit-user-root">
        <PageHeader title="Edit User" />

        <div className="sa-edit-user-card" role="region" aria-labelledby="edit-user-heading">
          <div className="sa-edit-user-head" id="edit-user-heading">
            <h2>Edit User</h2>
            <p className="sa-edit-user-muted">Update profile, role or password</p>
          </div>

          <div className="sa-edit-user-body">
            <form className="sa-edit-user-form-grid" onSubmit={submit} autoComplete="off">

              <label className="sa-edit-user-label">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  required
                />
              </label>

              <label className="sa-edit-user-label">
                <span>Email (read-only)</span>
                <input value={form.email} readOnly />
              </label>

              <label className="sa-edit-user-label">
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, role: e.target.value }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </label>

              <label className="sa-edit-user-label">
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
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  type="button"
                  className="sa-edit-user-btn sa-edit-user-outline"
                  onClick={() => nav("/super-admin/admin")} // ⭐ FIXED
                  disabled={saving}
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
