import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../lib/api";

export default function Reward() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      const studentId = student?._id || student?.id || student?.studentId;

      if (!studentId) {
        setLoading(false);
        return;
      }

      const res = await API.get(`/certificates/student/${studentId}`);
      setCertificates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (certId, name, fallbackUrl) => {
    const token = localStorage.getItem("token");
    if (certId) {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/certificates/download/${certId}?token=${token}`;
      window.open(downloadUrl, "_blank");
    } else {
      window.open(fallbackUrl, "_blank");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">🏆 My Certificates & Rewards</h1>
        <span className="badge bg-primary px-3 py-2" style={{ borderRadius: "20px", fontSize: "14px" }}>
          Total Earned: {certificates.length}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Retrieving your rewards...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="card shadow-sm border-0 text-center py-5" style={{ borderRadius: "15px" }}>
          <div className="card-body">
            <span style={{ fontSize: "60px" }}>🎁</span>
            <h4 className="mt-3">No Certificates Yet</h4>
            <p className="text-muted">Participate in quizzes and activities to earn certificates!</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm border-0"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                }}
              >
                <div
                  className="bg-primary text-white p-4 text-center d-flex flex-column align-items-center justify-content-center"
                  style={{ minHeight: "140px" }}
                >
                  <span style={{ fontSize: "40px" }}>🎓</span>
                  <div className="fw-bold mt-2" style={{ fontSize: "15px" }}>
                    SwanZaa Academy
                  </div>
                </div>

                <div className="card-body d-flex flex-column justify-content-between p-4">
                  <div>
                    <h5 className="card-title fw-bold text-dark mb-2">{cert.certificateName}</h5>
                    <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
                      📅 Earned on: {new Date(cert.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="d-grid gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/student/reward/preview/${cert._id}`, { state: { cert } })}
                      style={{ borderRadius: "10px", fontWeight: "600" }}
                    >
                      👁️ Preview Certificate
                    </button>
                    <button
                      className="btn btn-primary text-white"
                      onClick={() => handleDownload(cert._id, cert.certificateName, cert.certificateUrl)}
                      style={{ borderRadius: "10px", fontWeight: "600" }}
                    >
                      ⬇️ Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}