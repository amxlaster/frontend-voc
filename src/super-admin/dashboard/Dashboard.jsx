// frontend/src/super-admin/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    API.get("/auth/me")
      .then((res) => {
        if (!mounted) return;
        setUser(res.data.user);
        setLoadingUser(false);
      })
      .catch(() => setLoadingUser(false));

    API.get("/users?role=student")
      .then((r) => {
        if (!mounted) return;
        setStats({ students: r.data.users?.length ?? 0 });
      })
      .catch(() => {});

    return () => { mounted = false };
  }, []);

  return (
    <Layout>
      <div className="sa-dash-layout">

        <div className="sa-dash-main-area">
          <div className="sa-dash-content">

            <div className="sa-dash-hero">
              <div>
                <h1>
                  Welcome{user?.name ? `, ${user.name}` : ", Admin"} 👋
                </h1>
                <p className="sa-muted">Role: {user?.role ?? "loading..."}</p>
              </div>

              <div className="sa-dash-quick">
                {/* ⭐ FIXED ROUTES */}
                <Link to="/super-admin/admin/create" className="sa-btn sa-primary">
                  Create Admin
                </Link>

                <Link to="/super-admin/student/create" className="sa-btn sa-outline">
                  Create Student
                </Link>
              </div>
            </div>

            <div className="sa-dash-grid">

              {/* ⭐ FIXED ADMIN LIST CARD */}
              <Link to="/super-admin/admin" className="sa-card-link">
                <div className="sa-card">
                  <h3>Admins</h3>
                  <p>View and manage admins</p>
                  <div className="sa-card-kpi"></div>
                </div>
              </Link>

              {/* ⭐ FIXED STUDENT LIST CARD */}
              <Link to="/super-admin/student" className="sa-card-link">
                <div className="sa-card">
                  <h3>Students</h3>
                  <p>Manage student accounts</p>
                </div>
              </Link>

              {/* ⭐ FIXED CREATE ADMIN */}
              <Link to="/super-admin/admin/create" className="sa-card-link">
                <div className="sa-card">
                  <h3>Create Admin</h3>
                  <p>Add a new admin account</p>
                </div>
              </Link>

              {/* ⭐ FIXED CREATE STUDENT */}
              <Link to="/super-admin/student/create" className="sa-card-link">
                <div className="sa-card">
                  <h3>Create Student</h3>
                  <p>Bulk or single student creation</p>
                </div>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
