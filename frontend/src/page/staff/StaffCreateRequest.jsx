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
      navigate("/staff/my-requests");
    } catch (err) {
      console.error("Error creating request:", err);
      setError("เกิดข้อผิดพลาดในการสร้างคำร้อง");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>📄 สร้างคำร้องใหม่</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <FormInput label="หัวข้อคำร้อง" value={title} onChange={setTitle} />
          <FormTextarea label="รายละเอียด" value={description} onChange={setDescription} />
          <FormInput label="แผนก" value={department} onChange={setDepartment} />
          <FormInput label="ประเภทบริการ" value={serviceType} onChange={setServiceType} />
          <FormInput type="date" label="วันที่ร้องขอ" value={requestDate} onChange={setRequestDate} />
          <FormInput
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

// 🔧 Form Field Components
const FormInput = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      placeholder={placeholder}
      style={styles.input}
    />
  </div>
);

const FormTextarea = ({ label, value, onChange }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
      required
      style={{ ...styles.input, resize: "vertical" }}
    />
  </div>
);

// 🎨 Styles
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    backgroundColor: "#ffffff",
    padding: "36px 40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "26px",
    textAlign: "center",
    marginBottom: "28px",
    color: "#1f2937",
    fontWeight: "700",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  field: {
    marginBottom: "18px",
  },
  label: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "6px",
    display: "block",
    color: "#374151",
  },
  input: {
    width: "95%",
    padding: "12px 16px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    outlineColor: "#3b82f6",
  },
  submitButton: {
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#dc2626",
    fontWeight: "500",
    marginBottom: "16px",
  },
};

export default CreateRequest;
