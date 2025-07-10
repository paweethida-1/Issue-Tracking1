import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  }, []);

  useEffect(() => {
    if (!user || !token) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:5000/api/request/my-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setRequests([]);
          setLoading(false);
          return;
        }
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch my requests:", err);
        setLoading(false);
      });
  }, [token, navigate, user]);

  const handleCreate = () => {
    navigate("/staff/my-requests/create");
  };

  const renderStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "รอดำเนินการ";
      case "IN_PROGRESS":
        return "กำลังดำเนินการ";
      case "COMPLETED":
        return "เสร็จสิ้น";
      case "REJECTED":
        return "ถูกปฏิเสธ";
      case "APPROVED":
        return "อนุมัติแล้ว";
      default:
        return status;
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <p
        style={{
          textAlign: "center",
          fontSize: "1.1rem",
          marginTop: 40,
          color: "#555",
        }}
      >
        Loading...
      </p>
    );

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#264653" }}>
        คำร้องของฉัน (Staff)
      </h2>

      <button
        onClick={handleCreate}
        style={{
          display: "block",
          margin: "0 auto 30px auto",
          padding: "12px 24px",
          backgroundColor: "#2a9d8f",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(42,157,143,0.4)",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#21867a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2a9d8f")}
      >
        สร้างคำร้องใหม่
      </button>

      {requests.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#777",
            marginTop: 40,
          }}
        >
          คุณยังไม่ได้สร้างคำร้อง
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {requests.map((req) => (
            <div
              key={req.id}
              style={{
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#fafafa",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)")
              }
            >
              <h3
                style={{
                  marginBottom: 8,
                  fontSize: "1.25rem",
                  color: "#264653",
                  fontWeight: "700",
                }}
              >
                {req.title}
              </h3>
              <p style={{ marginBottom: 6, fontSize: "1rem", color: "#555" }}>
                <strong>ผู้แจ้ง: </strong> {user?.name || "-"}
              </p>
              <p style={{ marginBottom: 6, fontSize: "1rem", color: "#555" }}>
                <strong>สถานะ: </strong> {renderStatus(req.status)}
              </p>
              <p style={{ marginBottom: 12, fontSize: "1rem", color: "#555" }}>
                <strong>วันที่แจ้ง: </strong> {formatDate(req.requestDate)}
              </p>
              <Link
                to={`/staff/issues/${req.id}`}
                style={{
                  fontWeight: "600",
                  color: "#e76f51",
                  textDecoration: "none",
                  fontSize: "1rem",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d44b32")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#e76f51")}
              >
                ดูรายละเอียด &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
