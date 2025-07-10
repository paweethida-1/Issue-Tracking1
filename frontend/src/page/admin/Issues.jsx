import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  NEW: { color: "#3498db", label: "ใหม่" },
  APPROVED: { color: "#2ecc71", label: "อนุมัติ" },
  IN_PROGRESS: { color: "#f39c12", label: "กำลังดำเนินการ" },
  COMPLETED: { color: "#27ae60", label: "ปิดงาน" },
  REJECTED: { color: "#e74c3c", label: "ปฏิเสธ" },
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Issues = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบคำร้องนี้?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("ลบคำร้องสำเร็จ");
        fetchRequests();
      } else {
        alert("ลบคำร้องไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Error deleting request", err);
      alert("เกิดข้อผิดพลาดในการลบคำร้อง");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Issues Ticket</h2>

      {/* Header */}
      <div
        style={{
          display: "grid",
          // กำหนดระยะห่างระหว่าง columns: 
          // เรื่อง และ Action ช่องกว้าง 2 หน่วย, ส่วนช่องอื่น ๆ ช่องละ 1 หน่วย เท่ากันหมด
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          backgroundColor: "#1f2d3d",
          color: "#fff",
          padding: "12px 20px",
          fontWeight: "700",
          fontSize: "14px",
          borderRadius: "6px 6px 0 0",
          textAlign: "center",
        }}
      >
        <div style={{ textAlign: "left" }}>เรื่อง</div>
        <div>แผนก</div>
        <div>Due Date</div>
        <div>Priority</div>
        <div>สถานะ</div>
        <div>Action</div>
      </div>

      {/* Cards */}
      {requests.map((req) => {
        const statusStyle =
          statusStyles[req.status] || { color: "gray", label: req.status || "-" };
        return (
          <div
            key={req.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
              padding: "15px 20px",
              borderBottom: "1px solid #ddd",
              alignItems: "center",
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "left", fontWeight: "600", fontSize: "15px" }}>
              {req.title || "-"}
            </div>
            <div>{req.department || "-"}</div>
            <div>{formatDate(req.requestDate)}</div>
            <div>{req.priority || "-"}</div>
            <div style={{ color: statusStyle.color, fontWeight: "600" }}>
              {statusStyle.label}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <Link
                to={`/admin/issues/${req.id}`}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(req.id)}
                style={{
                  padding: "6px 14px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Issues;
