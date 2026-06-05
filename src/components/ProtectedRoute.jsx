// frontend/src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../lib/api";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { 
      setOk(false); 
      return; 
    }

    API.get("/auth/me")
      .then(res => {
        if (res.data.user?.role === "superadmin") {
          setOk(true);
        } else {
          setOk(false);
        }
      })
      .catch(() => setOk(false));
  }, []);

  if (ok === null) 
    return <div style={{ padding: 20 }}>Checking session...</div>;

  if (!ok) 
    return <Navigate to="/super-admin" replace />;  
    // 🔥 FIXED — go to Super Admin Login

  return children;
}
