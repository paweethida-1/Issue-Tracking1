import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  NEW: { color: "#3498db", label: "ใหม่" },
  APPROVED: { color: "#2ecc71", label: "อนุมัติ" },
  IN_PROGRESS: { color: "#f39c12", label: "กำลังดำเนินการ" },
  COMPLETED: { color: "#27ae60", label: "ปิดงาน" },
  REJECTED: { color: "#e74c3c", label: "ปฏิเสธ" },
};

const priorityColors = {
  HIGH: "#e74c3c",
  MEDIUM: "#f39c12",
  LOW: "#2ecc71",
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

const AssignedIssues = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/request/assigned", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error("Failed to fetch assigned requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>ใบแจ้งงานของ Staff</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.5fr auto",
          backgroundColor: "#1f2d3d",
          color: "#fff",
          padding: "12px 20px",
          fontWeight: "700",
          fontSize: "14px",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <div>เรื่อง</div>
        <div>แผนก</div>
        <div>Due Date</div>
        <div>Priority</div>
        <div>สถานะ</div>
        <div>ผู้รับผิดชอบ</div> {/* เพิ่มคอลัมน์นี้ */}
        <div>Action</div>
      </div>

      {loading ? (
        <div style={{ padding: "20px" }}>กำลังโหลดข้อมูล...</div>
      ) : requests.length === 0 ? (
        <div style={{ padding: "20px" }}>
          ไม่มีใบแจ้งงานที่ได้รับมอบหมาย
        </div>
      ) : (
        requests.map((req) => {
          const statusStyle =
            statusStyles[req.status] || { color: "gray", label: req.status || "-" };
          const priorityColor = priorityColors[req.priority] || "#333";

          return (
            <div
              key={req.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1.5fr auto",
                padding: "15px 20px",
                borderBottom: "1px solid #ddd",
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "15px" }}>
                {req.title || "-"}
              </div>
              <div>{req.department || "-"}</div>
              <div>{formatDate(req.requestDate)}</div>
              <div style={{ color: priorityColor, fontWeight: "600" }}>
                {req.priority || "-"}
              </div>
              <div style={{ color: statusStyle.color, fontWeight: "600" }}>
                {statusStyle.label}
              </div>
              <div>{req.assignedTo?.name || "-"}</div> {/* แสดงชื่อ staff */}
              <div>
                {req.id ? (
                  <Link
                    to={`/staff/issues/${req.id}`}
                    style={{
                      padding: "6px 14px",
                      backgroundColor: "#1f2d3d",
                      color: "#fff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    View
                  </Link>
                ) : (
                  <span style={{ color: "gray" }}>No ID</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AssignedIssues;
