import { useEffect, useState } from "react";
import API from "../../lib/api";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

export default function UploadCertificate() {
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("single");

  // Single Upload State
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [singleCertName, setSingleCertName] = useState("Participation Certificate");
  const [singleFile, setSingleFile] = useState(null);
  const [singleUploading, setSingleUploading] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");

  // Bulk Upload State
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkCertName, setBulkCertName] = useState("");
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  // Logs State
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedLogErrors, setSelectedLogErrors] = useState(null);

  useEffect(() => {
    loadStudents();
    loadLogs();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.students || res.data || []);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  const loadLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await API.get("/certificates/logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSingleUpload = async (e) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert("Please select a student");
      return;
    }
    if (!singleFile) {
      alert("Please select a certificate file");
      return;
    }

    setSingleUploading(true);
    const formData = new FormData();
    formData.append("certificate", singleFile);
    formData.append("studentId", selectedStudentId);
    formData.append("certificateName", singleCertName);

    try {
      await API.post("/certificates/upload-single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Certificate uploaded and assigned successfully!");
      setSingleFile(null);
      // Reset file input
      const fileInput = document.getElementById("single-file-input");
      if (fileInput) fileInput.value = "";
      loadLogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setSingleUploading(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (bulkFiles.length === 0) {
      alert("Please select PDF/ZIP files to upload");
      return;
    }

    setBulkUploading(true);
    setBulkResult(null);
    const formData = new FormData();
    for (let i = 0; i < bulkFiles.length; i++) {
      formData.append("certificates", bulkFiles[i]);
    }
    if (bulkCertName) {
      formData.append("certificateName", bulkCertName);
    }

    try {
      const res = await API.post("/certificates/upload-bulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBulkResult(res.data.log);
      alert("Bulk upload processed!");
      setBulkFiles([]);
      const fileInput = document.getElementById("bulk-file-input");
      if (fileInput) fileInput.value = "";
      loadLogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Bulk upload failed");
    } finally {
      setBulkUploading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-4">
        <PageHeader title="Reward & Certificate Manager" />

        {/* Tab Controls */}
        <ul className="nav nav-pills mb-4" style={{ gap: "10px" }}>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "single" ? "active bg-primary text-white" : "bg-light text-dark"}`}
              onClick={() => setActiveTab("single")}
              style={{ borderRadius: "20px", fontWeight: "600", transition: "all 0.2s" }}
            >
              👤 Single Student Upload
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "bulk" ? "active bg-primary text-white" : "bg-light text-dark"}`}
              onClick={() => setActiveTab("bulk")}
              style={{ borderRadius: "20px", fontWeight: "600", transition: "all 0.2s" }}
            >
              📦 Bulk Upload (ZIP / PDFs)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "logs" ? "active bg-primary text-white" : "bg-light text-dark"}`}
              onClick={() => {
                setActiveTab("logs");
                loadLogs();
              }}
              style={{ borderRadius: "20px", fontWeight: "600", transition: "all 0.2s" }}
            >
              📋 Upload Logs
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
          {activeTab === "single" && (
            <form onSubmit={handleSingleUpload}>
              <h4 className="mb-4 text-primary">Upload Certificate for a Student</h4>

              {/* Student Search & Select */}
              <div className="mb-3">
                <label className="form-label fw-bold">Select Student</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="🔍 Type student name or email to filter..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
                <select
                  className="form-select"
                  size="5"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  style={{ borderRadius: "10px" }}
                  required
                >
                  {filteredStudents.length === 0 ? (
                    <option disabled>No students found</option>
                  ) : (
                    filteredStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.email})
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Certificate Name */}
              <div className="mb-3">
                <label className="form-label fw-bold">Certificate Name / Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={singleCertName}
                  onChange={(e) => setSingleCertName(e.target.value)}
                  placeholder="e.g. Participation Certificate"
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              {/* Certificate File */}
              <div className="mb-4">
                <label className="form-label fw-bold">Upload File (PDF or Image)</label>
                <input
                  type="file"
                  id="single-file-input"
                  className="form-control"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                  style={{ borderRadius: "10px" }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary px-4 py-2 text-white"
                style={{ borderRadius: "10px", fontWeight: "600" }}
                disabled={singleUploading}
              >
                {singleUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  "Submit Certificate"
                )}
              </button>
            </form>
          )}

          {activeTab === "bulk" && (
            <form onSubmit={handleBulkUpload}>
              <h4 className="mb-4 text-primary">Bulk Upload Certificates</h4>
              <p className="text-muted">
                You can upload a single **ZIP file** containing certificates, or select **multiple PDF/Image files** at once.
                Files will be mapped automatically using the filename (matching to Student ID, Email, or Email Prefix/Registration Number).
              </p>

              {/* Certificate Name Override */}
              <div className="mb-3">
                <label className="form-label fw-bold">Certificate Name Override (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={bulkCertName}
                  onChange={(e) => setBulkCertName(e.target.value)}
                  placeholder="If blank, uses filename as title"
                  style={{ borderRadius: "10px" }}
                />
              </div>

              {/* File Input */}
              <div className="mb-4">
                <label className="form-label fw-bold">Choose Files (Multiple PDFs or ZIP)</label>
                <input
                  type="file"
                  id="bulk-file-input"
                  className="form-control"
                  accept=".pdf,.zip,.png,.jpg,.jpeg"
                  multiple
                  onChange={(e) => setBulkFiles(e.target.files)}
                  style={{ borderRadius: "10px" }}
                  required
                />
                {bulkFiles.length > 0 && (
                  <div className="mt-2 text-primary fw-bold">Selected {bulkFiles.length} file(s)</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary px-4 py-2 text-white"
                style={{ borderRadius: "10px", fontWeight: "600" }}
                disabled={bulkUploading}
              >
                {bulkUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing Bulk Upload...
                  </>
                ) : (
                  "Start Bulk Process"
                )}
              </button>

              {bulkResult && (
                <div className="card mt-4 border-primary">
                  <div className="card-header bg-primary text-white fw-bold">Upload Summary</div>
                  <div className="card-body">
                    <p><strong>Status:</strong> <span className="badge bg-secondary">{bulkResult.status}</span></p>
                    <p><strong>Total Files Found:</strong> {bulkResult.totalFiles}</p>
                    <p><strong>Assigned Successfully:</strong> {bulkResult.assignedCount}</p>
                    {bulkResult.errors && bulkResult.errors.length > 0 && (
                      <div>
                        <strong className="text-danger">Unassigned/Errors:</strong>
                        <ul className="text-danger mt-1">
                          {bulkResult.errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          )}

          {activeTab === "logs" && (
            <div>
              <h4 className="mb-4 text-primary">Certificate Upload History</h4>
              {loadingLogs ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2 text-muted">Loading logs...</p>
                </div>
              ) : logs.length === 0 ? (
                <p className="text-muted text-center py-4">No upload logs found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Uploaded Date</th>
                        <th>Filename / Batch</th>
                        <th>Status</th>
                        <th>Total Files</th>
                        <th>Assigned</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id}>
                          <td>{new Date(log.createdAt).toLocaleString()}</td>
                          <td>{log.filename}</td>
                          <td>
                            <span
                              className={`badge ${
                                log.status === "success"
                                  ? "bg-success"
                                  : log.status === "partial_success"
                                  ? "bg-warning text-dark"
                                  : "bg-danger"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td>{log.totalFiles}</td>
                          <td>{log.assignedCount}</td>
                          <td>
                            {log.errors && log.errors.length > 0 ? (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => setSelectedLogErrors(log.errors)}
                                style={{ borderRadius: "5px" }}
                              >
                                View Errors ({log.errors.length})
                              </button>
                            ) : (
                              <span className="text-success fw-bold">✓ Clean</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Errors Modal */}
      {selectedLogErrors && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content" style={{ borderRadius: "15px" }}>
              <div className="modal-header bg-danger text-white" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
                <h5 className="modal-title">Unassigned Files / Errors</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedLogErrors(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <ul className="list-group">
                  {selectedLogErrors.map((err, i) => (
                    <li key={i} className="list-group-item text-danger">
                      ⚠️ {err}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedLogErrors(null)}
                  style={{ borderRadius: "10px" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}