import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../../lib/api";

export default function CertificatePreview() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [cert, setCert] = useState(location.state?.cert || null);
  const [loading, setLoading] = useState(!cert);

  useEffect(() => {
    if (!cert) {
      loadCertificate();
    }
  }, [id]);

  const loadCertificate = async () => {
    try {
      const student = JSON.parse(localStorage.getItem("student"));
      const studentId = student?._id || student?.id || student?.studentId;

      if (!studentId) {
        navigate("/student/reward");
        return;
      }

      // Query student certificates to find the matching one
      const res = await API.get(`/certificates/student/${studentId}`);
      const found = res.data.find((c) => c._id === id);
      if (found) {
        setCert(found);
      } else {
        alert("Certificate not found or unauthorized access.");
        navigate("/student/reward");
      }
    } catch (err) {
      console.error(err);
      navigate("/student/reward");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cert) return;
    const token = localStorage.getItem("token");
    if (cert._id) {
      const downloadUrl = `${import.meta.env.VITE_API_URL}/certificates/download/${cert._id}?token=${token}`;
      window.open(downloadUrl, "_blank");
    } else {
      window.open(cert.certificateUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading preview...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="container py-5 text-center">
        <h4>Certificate Not Found</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/student/reward")}>
          Back to Rewards
        </button>
      </div>
    );
  }

  const isPdf = cert.certificateUrl.toLowerCase().includes(".pdf");
  const isCloudinary = cert.certificateUrl.includes("res.cloudinary.com");

  // If it's a Cloudinary PDF, we convert the URL to a JPG for a perfect inline image preview
  const previewUrl = (isPdf && isCloudinary)
    ? cert.certificateUrl.substring(0, cert.certificateUrl.lastIndexOf(".")) + ".jpg"
    : cert.certificateUrl;

  const showAsImage = !isPdf || (isPdf && isCloudinary);

  return (
    <div className="container py-4">
      {/* Title Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
            onClick={() => navigate("/student/reward")}
            style={{ borderRadius: "50%", width: "40px", height: "40px", padding: 0 }}
            title="Go Back"
          >
            ←
          </button>
          <div>
            <h2 className="h4 mb-0 text-dark fw-bold">{cert.certificateName}</h2>
            <small className="text-muted">
              Earned on {new Date(cert.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>

        <button
          className="btn btn-primary text-white px-4 py-2"
          onClick={handleDownload}
          style={{ borderRadius: "10px", fontWeight: "600" }}
        >
          ⬇️ Download Certificate
        </button>
      </div>

      {/* Embedded Viewer */}
      <div
        className="card shadow-sm border-0 overflow-hidden"
        style={{
          borderRadius: "15px",
          backgroundColor: "#ebebeb",
          minHeight: "70vh",
        }}
      >
        <div className="card-body p-0 d-flex align-items-center justify-content-center">
          {showAsImage ? (
            <img
              src={previewUrl}
              alt={cert.certificateName}
              style={{
                maxWidth: "95%",
                maxHeight: "70vh",
                objectFit: "contain",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                borderRadius: "8px",
                margin: "20px 0"
              }}
            />
          ) : (
            <iframe
              src={`${cert.certificateUrl}#toolbar=0`}
              title={cert.certificateName}
              width="100%"
              height="700px"
              style={{ border: "none", display: "block" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
