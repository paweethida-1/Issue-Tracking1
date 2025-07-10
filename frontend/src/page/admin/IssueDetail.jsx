import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [priority, setPriority] = useState("");
  const [staffId, setStaffId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ฟังก์ชันดึงข้อมูลคำร้อง
  const fetchRequest = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch request");
      const data = await res.json();
      setRequest(data);
      setPriority(data.priority || "");
      setStaffId(data.assignedToId ? String(data.assignedToId) : "");
    } catch (err) {
      console.error(err);
      setError("ไม่สามารถโหลดคำร้องได้");
    }
  };

  // ฟังก์ชันดึง Log การเปลี่ยนสถานะ
  const fetchLogs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch logs");
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ฟังก์ชันดึงรายชื่อ staff สำหรับมอบหมาย
  const fetchStaffList = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch staff list");
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      setStaffList([]);
    }
  };

  useEffect(() => {
    if (!token || !user) return navigate("/");

    const fetchAll = async () => {
      await Promise.all([fetchRequest(), fetchLogs(), fetchStaffList()]);
      setLoading(false);
    };

    fetchAll();
  }, [id, token, user, navigate]);

  // ฟังก์ชันอนุมัติ (Approve)
  const handleApprove = async () => {
    if (!priority || !staffId) {
      alert("กรุณาเลือก Priority และผู้รับผิดชอบ");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority, staffId: Number(staffId) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      alert("อนุมัติสำเร็จ");
      await fetchRequest();
      await fetchLogs();
      setIsEditing(false);
    } catch (err) {
      alert("เกิดข้อผิดพลาดขณะอนุมัติ");
    }
  };

  // ฟังก์ชันปฏิเสธ (Reject)
  const handleReject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "เกิดข้อผิดพลาด");
        return;
      }

      alert("ปฏิเสธเรียบร้อย");
      await fetchRequest();
      await fetchLogs();
      setIsEditing(false);
    } catch (err) {
      alert("เกิดข้อผิดพลาดขณะปฏิเสธ");
    }
  };

  // เริ่มแก้ไข
  const handleEditClick = () => setIsEditing(true);

  // ยกเลิกแก้ไข
  const handleCancelEdit = () => {
    setPriority(request.priority || "");
    setStaffId(request.assignedToId ? String(request.assignedToId) : "");
    setIsEditing(false);
  };

  // บันทึกการแก้ไข
  const handleSaveEdit = async () => {
    if (!priority || !staffId) {
      alert("กรุณาเลือก Priority และผู้รับผิดชอบ");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/request/${id}/update-assignment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority, staffId: Number(staffId) }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "เกิดข้อผิดพลาดขณะบันทึก");
        return;
      }

      alert("แก้ไขข้อมูลสำเร็จ");
      await fetchRequest();
      await fetchLogs();
      setIsEditing(false);
    } catch (err) {
      alert("เกิดข้อผิดพลาดขณะบันทึกข้อมูล");
    }
  };

  // แสดงหลอดสถานะพร้อม log แสดงใต้เลขสถานะ
  const renderProgress = () => {
    const steps = ["ผู้แจ้ง", "อนุมัติ", "รับงาน", "ปิดงาน"];
    const statusIndex = {
      PENDING: 1,
      APPROVED: 2,
      IN_PROGRESS: 3,
      COMPLETED: 4,
    };
    const current = statusIndex[request?.status] || 1;

    // จัดกลุ่ม log ตาม status
    const logsByStatus = {};
    logs.forEach((log) => {
      if (!logsByStatus[log.status]) logsByStatus[log.status] = [];
      logsByStatus[log.status].push(log);
    });

    return (
      <div style={{ margin: "30px 0" }}>
        <h3 style={{ color: "#444", marginBottom: 12 }}>สถานะการดำเนินการ</h3>
        <div style={{ background: "#eee", height: 10, borderRadius: 5, marginBottom: 15 }}>
          <div
            style={{
              background: "limegreen",
              width: `${(current / 4) * 100}%`,
              height: "100%",
              borderRadius: 5,
              transition: "width 0.3s",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {steps.map((s, i) => {
            const stepNum = i + 1;
            const stepStatus = Object.keys(statusIndex).find(
              (key) => statusIndex[key] === stepNum
            );

            return (
              <div key={i} style={{ textAlign: "center", width: "25%" }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: stepNum <= current ? "limegreen" : "#ccc",
                    color: "white",
                    lineHeight: "30px",
                    margin: "auto",
                    fontWeight: "bold",
                  }}
                >
                  {stepNum}
                </div>
                <div style={{ marginTop: 6, fontWeight: "600", color: "#222" }}>{s}</div>
                <div style={{ marginTop: 5, fontSize: 12, color: "#333", minHeight: 35 }}>
                  {logsByStatus[stepStatus]?.map((log) => (
                    <div key={log.id}>
                      [{new Date(log.timestamp).toLocaleString()}] {log.status} - โดย{" "}
                      {log.actionBy?.name || "-"}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // แสดงส่วนจัดการของแอดมิน
  const renderAdminActions = () => {
    if (!user || (user.role !== "ADMIN" && user.role !== "ADMIN_STAFF")) return null;
    if (!request) return null;

    // ถ้าคำร้องยังเป็น PENDING ให้แสดงช่องกรอกใหม่สำหรับ Approve/Reject
    if (request.status === "PENDING") {
      return (
        <div
          style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 16,
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: 1500,
          }}
        >
          <h3 style={{ marginBottom: 20, color: "#444" }}>📝 รายละเอียดการจ่ายงาน</h3>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#333" }}
            >
              ระดับความสำคัญ:
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: "50%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            >
              <option value="">-- เลือก Priority --</option>
              <option value="HIGH">🔴 สูง (ภายใน 2 วัน)</option>
              <option value="MEDIUM">🟠 กลาง (ภายใน 5 วัน)</option>
              <option value="LOW">🟢 ต่ำ (ภายใน 7 วัน)</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: "600", color: "#333" }}
            >
              มอบหมายให้:
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              style={{
                width: "50%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            >
              <option value="">-- เลือกผู้รับผิดชอบ --</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}
          >
            <button
              onClick={handleApprove}
              style={{
                flex: 1,
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 0",
                marginRight: 12,
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
            >
              ✅ อนุมัติ
            </button>
            <button
              onClick={handleReject}
              style={{
                flex: 1,
                backgroundColor: "#f44336",
                color: "white",
                padding: "12px 0",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#da190b")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f44336")}
            >
              ❌ ไม่อนุมัติ
            </button>
          </div>
        </div>
      );
    }

    // ถ้าไม่ใช่ PENDING และ user เป็น admin ให้แสดงข้อมูลพร้อมปุ่มแก้ไข
    return (
      <div
        style={{
          marginTop: 40,
          border: "1px solid #ccc",
          padding: 24,
          borderRadius: 12,
          maxWidth: 1500,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ marginBottom: 20, color: "#444" }}>รายละเอียดการจ่ายงาน</h3>
        {!isEditing ? (
          <>
            <p style={{ fontSize: 16, marginBottom: 8 }}>
              ระดับความสำคัญ: <strong>{request.priority || "ไม่ระบุ"}</strong>
            </p>
            <p style={{ fontSize: 16, marginBottom: 16 }}>
              ผู้รับผิดชอบ:{" "}
              <strong>
                {request.assignedTo
                  ? `${request.assignedTo.name} (${request.assignedTo.email})`
                  : "ไม่ระบุ"}
              </strong>
            </p>
            <button
              onClick={handleEditClick}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#2196F3",
                color: "white",
                cursor: "pointer",
                fontSize: 16,
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1976d2")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
            >
              แก้ไข
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="priority-select"
                style={{ display: "block", marginBottom: 6, fontWeight: "600" }}
              >
                ระดับความสำคัญ:
              </label>
              <select
                id="priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: 16,
                }}
              >
                <option value="">-- เลือก Priority --</option>
                <option value="HIGH">สูง (ภายใน 2 วัน)</option>
                <option value="MEDIUM">กลาง (ภายใน 5 วัน)</option>
                <option value="LOW">ต่ำ (ภายใน 7 วัน)</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="staff-select"
                style={{ display: "block", marginBottom: 6, fontWeight: "600" }}
              >
                มอบหมายให้:
              </label>
              <select
                id="staff-select"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  width: "100%",
                  fontSize: 16,
                }}
              >
                <option value="">-- เลือกผู้รับผิดชอบ --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={handleSaveEdit}
                style={{
                  flex: 1,
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "12px 0",
                  borderRadius: 8,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
              >
                บันทึก
              </button>
              <button
                onClick={handleCancelEdit}
                style={{
                  flex: 1,
                  backgroundColor: "#999",
                  color: "white",
                  padding: "12px 0",
                  borderRadius: 8,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#777")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#999")}
              >
                ยกเลิก
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!request) return <p>ไม่พบคำร้อง</p>;

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1500, width: "100%" }}>
        {/* ข้อมูลคำร้องพื้นฐาน */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: 24,
            borderRadius: 16,
            marginBottom: 30,
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ color: "#555", marginBottom: 8 }}>
            เลขที่ใบงาน:{" "}
            <span style={{ fontWeight: "bold" }}>
              {request.code || `ISS-${request.id}`}
            </span>
          </h3>
          <h2 style={{ marginBottom: 12, color: "#222" }}>{request.title}</h2>
          <p style={{ marginBottom: 6 }}>
            <strong>ผู้แจ้ง:</strong> {request.user?.name || "ไม่ทราบ"}
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong>วันที่สร้าง:</strong>{" "}
            {new Date(request.requestDate).toLocaleString()}
          </p>
          <p style={{ marginBottom: 6 }}>
            <strong>รายละเอียด:</strong> {request.description}
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>สถานะ:</strong>{" "}
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                backgroundColor:
                  request.status === "PENDING"
                    ? "#f0ad4e"
                    : request.status === "APPROVED"
                    ? "#5bc0de"
                    : request.status === "IN_PROGRESS"
                    ? "#0275d8"
                    : request.status === "COMPLETED"
                    ? "#5cb85c"
                    : "#ccc",
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
                textTransform: "uppercase",
              }}
            >
              {request.status}
            </span>
          </p>
        </div>

        {/* หลอดสถานะพร้อม log */}
        {renderProgress()}

        {/* ส่วนจัดการของแอดมิน */}
        {renderAdminActions()}

        {/* การ์ดแสดงรายละเอียดทีมและงานปิด */}
        {(request.team?.length > 0 || request.details || request.completedImageUrl) && (
          <div
            style={{
              marginTop: 30,
              padding: 24,
              borderRadius: 16,
              border: "1px solid #ddd",
              backgroundColor: "#fefefe",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                borderBottom: "2px solid #4caf50",
                paddingBottom: 10,
                marginBottom: 20,
                color: "#4caf50",
              }}
            >
              รายละเอียดการดำเนินงาน
            </h3>

            {request.assignedTo && (
              <p style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
                ผู้รับผิดชอบ:{" "}
                <span style={{ color: "#333" }}>
                  {request.assignedTo.name} ({request.assignedTo.email})
                </span>
              </p>
            )}

            {request.team && request.team.length > 0 && (
              <>
                <p style={{ fontWeight: "600", marginBottom: 8, color: "#555" }}>
                  ทีมที่รับผิดชอบ:
                </p>
                <ul
                  style={{
                    listStyle: "inside disc",
                    paddingLeft: 0,
                    marginBottom: 20,
                    color: "#444",
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {request.team.map((member) => (
                    <li
                      key={member.id}
                      style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}
                    >
                      {member.user?.name} <span style={{ color: "#888" }}>({member.role})</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {request.details && (
              <>
                <p style={{ fontWeight: "600", marginBottom: 6, color: "#555" }}>
                  รายละเอียดงานที่ดำเนินการ:
                </p>
                <p
                  style={{
                    backgroundColor: "#f7f7f7",
                    padding: 15,
                    borderRadius: 10,
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {request.details}
                </p>
              </>
            )}

            {request.completedImageUrl && (
              <img
                src={request.completedImageUrl}
                alt="Completed Work"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginTop: 20,
                  borderRadius: 12,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDetail;
