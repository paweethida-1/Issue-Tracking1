import React from "react";
import { useNavigate } from "react-router-dom";

// ไอคอน SVG แบบง่าย ๆ
const StaffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="none"
    stroke="#444"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M9 17v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M7 12h10" />
  </svg>
);

const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    fill="#444"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="7" r="4" />
    <path
      fill="#444"
      d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2z"
    />
  </svg>
);

const SelectRole = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN_STAFF") {
    navigate("/");
    return null;
  }

  const handleSelect = (role) => {
    localStorage.setItem("selectedRole", role);

    if (role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (role === "STAFF") {
      navigate("/staff/dashboard");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>เลือกบทบาทของคุณ (Select Role)</h2>
        <div style={styles.buttonRow}>
          <div
            onClick={() => handleSelect("STAFF")}
            style={{ ...styles.card, ...styles.staffCard }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(38,166,91,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)")
            }
          >
            <div style={styles.cardText}>STAFF</div>
            <StaffIcon />
          </div>
          <div
            onClick={() => handleSelect("ADMIN")}
            style={{ ...styles.card, ...styles.adminCard }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(32,101,209,0.3)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)")
            }
          >
            <div style={styles.cardText}>ADMIN</div>
            <AdminIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#282c38",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    maxWidth: 480,
    width: "90%",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    marginBottom: 48,
    color: "#222",
    fontWeight: "700",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: 40,
  },
  card: {
    cursor: "pointer",
    width: 140,
    height: 120,
    borderRadius: 12,
    border: "1px solid #ccc",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
    transition: "box-shadow 0.3s ease",
  },
  cardText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    userSelect: "none",
  },
  staffCard: {
    // สีเน้นของ staff
    borderColor: "#26a65b",
  },
  adminCard: {
    // สีเน้นของ admin
    borderColor: "#2065d1",
  },
};

export default SelectRole;
