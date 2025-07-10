import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StaffIssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [request, setRequest] = useState(null);
  const [logs, setLogs] = useState([]);
  const [details, setDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !user) return navigate("/");

    const fetchAll = async () => {
      try {
        await Promise.all([fetchRequest(), fetchLogs(), fetchStaffList()]);
      } catch {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, token, user, navigate]);

  const fetchRequest = async () => {
    const res = await fetch(`http://localhost:5000/api/request/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRequest(data);
    setDetails(data.details || "");
    setImageUrl(data.completedImageUrl || "");
  };

  const fetchLogs = async () => {
    const res = await fetch(`http://localhost:5000/api/request/${id}/logs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setLogs(data);
  };

  const fetchStaffList = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtered = data.filter(
        (user) => user.role === "STAFF" || user.role === "ADMIN_STAFF"
      );
      setStaffList(filtered);
    } catch (err) {
      console.error(err);
      setStaffList([]);
    }
  };

  const toggleMemberSelection = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleAddTeamMember = async () => {
    if (selectedMembers.length === 0) return alert("กรุณาเลือกสมาชิกทีม");

    const members = selectedMembers.map((id) => ({
      userId: parseInt(id),
      role: "MEMBER",
    }));

    const res = await fetch(`http://localhost:5000/api/request/${id}/team`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ members }),
    });

    if (res.ok) {
      const data = await res.json();
      alert("เพิ่มทีมสำเร็จ");
      setSelectedMembers([]);
      setRequest(data.request);
      await fetchLogs();
    } else {
      alert("เพิ่มทีมไม่สำเร็จ");
    }
  };

  const handleComplete = async () => {
    const res = await fetch(`http://localhost:5000/api/request/${id}/complete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ details, completedImageUrl: imageUrl }),
    });

    if (res.ok) {
      alert("ปิดงานเรียบร้อย");
      await fetchRequest();
      await fetchLogs();
    } else {
      alert("ไม่สามารถปิดงานได้");
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!request) return <p>ไม่พบคำร้อง</p>;

  return (
    <div style={{ padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1500, width: "100%" }}>
        {/* Card 1: รายละเอียดคำร้อง */}
        <div style={cardStyle}>
          <h3 style={headerStyle}>รายละเอียดคำร้อง</h3>
          <p><strong>หัวข้อ:</strong> {request.title}</p>
          <p><strong>รายละเอียด:</strong> {request.description}</p>
          <p><strong>ผู้แจ้ง:</strong> {request.user?.name || "-"}</p>
          <p><strong>สถานะ:</strong> {request.status}</p>
        </div>

        {/* Card 2: สถานะ + Logs */}
        <div style={cardStyle}>
          <h3 style={headerStyle}>สถานะคำร้อง</h3>
          <ProgressBar status={request.status} logs={logs} />
        </div>

        {/* Card 3: รายละเอียดการจ่ายงาน */}
        <div style={cardStyle}>
          <h3 style={headerStyle}>รายละเอียดการจ่ายงาน</h3>
          <p><strong>ระดับความสำคัญ:</strong> {request.priority || "-"}</p>
          <p>
            <strong>ผู้รับผิดชอบ:</strong>{" "}
            {request.assignedTo
              ? `${request.assignedTo.name} (${request.assignedTo.email})`
              : "-"}
          </p>
        </div>

        {/* Card 4: ทีมที่รับผิดชอบ (แสดงเฉพาะเมื่อมีสมาชิกทีมจริง) */}
        {request.team?.length > 0 && (
          <div style={cardStyle}>
            <h3 style={headerStyle}>ทีมที่รับผิดชอบ</h3>
            <ul style={{ paddingLeft: 20, color: "#444" }}>
              {request.team.map((member) => (
                <li key={member.id} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
                  {member.user?.name} <span style={{ color: "#888" }}>({member.role})</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 10, fontWeight: "600", color: "#333" }}>
              สมาชิกทีมที่เพิ่ม: {request.team.length} คน
            </p>
          </div>
        )}

        {/* Card 5: เลือกสมาชิกทีม */}
        {request.status === "APPROVED" && (
          <div style={cardStyle}>
            <h3 style={headerStyle}>เลือกสมาชิกทีม</h3>
            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 8,
                backgroundColor: "#fafafa",
              }}
            >
              {staffList.map((s) => (
                <label
                  key={s.id}
                  style={{
                    display: "block",
                    marginBottom: 8,
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: 15,
                    color: "#222",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(s.id.toString())}
                    onChange={() => toggleMemberSelection(s.id.toString())}
                    style={{ marginRight: 8 }}
                  />
                  {s.name} ({s.email})
                </label>
              ))}
            </div>
            <button
              onClick={handleAddTeamMember}
              style={{ ...buttonStyle, marginTop: 20 }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
            >
              รับงาน
            </button>
          </div>
        )}

        {/* Card 6: ปิดงาน */}
        {request.status === "IN_PROGRESS" && (
          <div style={cardStyle}>
            <h3 style={headerStyle}>รายละเอียดงานที่ดำเนินการ</h3>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
                resize: "vertical",
              }}
              placeholder="อธิบายรายละเอียดที่ดำเนินการ"
            />
            <input
              type="text"
              placeholder="URL ภาพหลังดำเนินการ"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
              }}
            />
            <button
              onClick={handleComplete}
              style={{ ...buttonStyle, marginTop: 12 }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
            >
              ปิดงาน
            </button>
          </div>
        )}

        {/* Card 7: รายละเอียดหลังปิดงาน */}
        {request.status === "COMPLETED" && (
          <div style={cardStyle}>
            <h3 style={headerStyle}>รายละเอียดการปิดงาน</h3>
            <p style={{ whiteSpace: "pre-wrap", fontSize: 16, color: "#333" }}>
              <strong>รายละเอียด:</strong> {request.details || "ไม่มี"}
            </p>
            {request.completedImageUrl && (
              <img
                src={request.completedImageUrl}
                alt="completed"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginTop: 20,
                  borderRadius: 12,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
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

// ProgressBar พร้อม Log ใต้ตัวเลข
const ProgressBar = ({ status, logs }) => {
  const steps = ["ผู้แจ้ง", "อนุมัติ", "รับงาน", "ปิดงาน"];
  const statusIndex = {
    PENDING: 1,
    APPROVED: 2,
    IN_PROGRESS: 3,
    COMPLETED: 4,
  };
  const current = statusIndex[status] || 1;

  // จัดกลุ่ม logs ตาม status
  const logsByStatus = {};
  logs.forEach((log) => {
    if (!logsByStatus[log.status]) logsByStatus[log.status] = [];
    logsByStatus[log.status].push(log);
  });

  return (
    <div>
      <div
        style={{
          background: "#eee",
          height: 10,
          borderRadius: 5,
          marginBottom: 10,
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
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
          const logsForStep = logsByStatus[Object.keys(statusIndex).find((key) => statusIndex[key] === stepNum)] || [];
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
              <div style={{ marginTop: 5, fontSize: 12, color: "#333", minHeight: 40 }}>
                {logsForStep.map((log) => (
                  <div key={log.id} style={{ marginBottom: 2 }}>
                    [{new Date(log.timestamp).toLocaleString()}] {log.status} - โดย {log.actionBy?.name || "-"}
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

const cardStyle = {
  border: "1px solid #ddd",
  padding: 24,
  borderRadius: 16,
  marginBottom: 30,
  backgroundColor: "#fff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const headerStyle = {
  marginBottom: 20,
  color: "#444",
  borderBottom: "2px solid #4caf50",
  paddingBottom: 8,
  fontWeight: "700",
  fontSize: 22,
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "12px 24px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: "600",
  transition: "background-color 0.3s",
};

export default StaffIssueDetail;
