import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRequest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formattedDate = new Date(requestDate).toISOString();

      const res = await fetch("http://localhost:5000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          department,
          serviceType,
          requestDate: formattedDate,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Failed to create request");
        return;
      }

      alert("✅ สร้างคำร้องสำเร็จ");
      navigate("/admin/my-requests");
    } catch (err) {
      console.error("Error creating request:", err);
      setError("เกิดข้อผิดพลาดในการสร้างคำร้อง");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📝 สร้างคำร้องใหม่</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <FormField label="หัวข้อคำร้อง" value={title} onChange={setTitle} />
          <FormTextArea label="รายละเอียด" value={description} onChange={setDescription} />
          <FormField label="แผนก" value={department} onChange={setDepartment} />
          <FormField label="ประเภทบริการ" value={serviceType} onChange={setServiceType} />
          <FormDate label="วันที่ร้องขอ" value={requestDate} onChange={setRequestDate} />
          <FormField
            label="URL รูปภาพ (ถ้ามี)"
            value={imageUrl}
            onChange={setImageUrl}
            placeholder="https://example.com/image.jpg"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton}>
            📤 ส่งคำร้อง
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ Components
const FormField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      style={styles.input}
    />
  </div>
);

const FormTextArea = ({ label, value, onChange }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      rows={4}
      style={{ ...styles.input, resize: "vertical" }}
    />
  </div>
);

const FormDate = ({ label, value, onChange }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      style={styles.input}
    />
  </div>
);

// ✅ Styles
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "720px", // 👈 เพิ่มความกว้างการ์ด
    backgroundColor: "#ffffff",
    padding: "36px 40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: 30,
    color: "#1f2937",
    fontSize: "26px",
    fontWeight: "700",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    display: "block",
    color: "#374151",
    fontSize: "15px",
  },
  input: {
    width: "95%",
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "#f9fafb",
    transition: "border 0.2s ease",
  },
  error: {
    color: "#dc2626",
    fontWeight: "500",
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 10,
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default CreateRequest;
