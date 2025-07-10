import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/issues", label: "Issues Ticket", icon: "🧾" },
    { path: "/admin/my-requests", label: "My Requests", icon: "📝" },
    { path: "/admin/users", label: "User Account", icon: "👤" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: "#1f2d3d",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80px",
          padding: "0 24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: "24px",
              color: "white",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
          <div>
            <h3 style={{ margin: 0, fontSize: "18px" }}>มูลนิธิแม่ฟ้าหลวง ในพระบรมราชูปถัมภ์</h3>
            <p style={{ margin: 0, fontSize: "12px", color: "#ccc" }}>
              Mae Fah Luang Foundation under Royal Patronage
            </p>
          </div>
        </div>

        {/* Avatar */}
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid white",
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#ccc",
            }}
          />
        )}
      </header>

      {/* Content Area */}
      <div style={{ display: "flex", flex: 1, marginTop: "80px" }}>
        {/* Sidebar */}
        <aside
          style={{
            width: sidebarOpen ? "220px" : "70px",
            background: "#ffffff",
            borderRight: "1px solid #ddd",
            transition: "width 0.3s",
            display: "flex",
            flexDirection: "column",
            alignItems: sidebarOpen ? "flex-start" : "center",
            padding: "20px 10px",
            minHeight: "calc(100vh - 80px)",
          }}
        >
          {menuItems.map(({ path, label, icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link
                to={path}
                key={path}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 12px",
                  gap: "14px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  textDecoration: "none",
                  background: isActive ? "#f1f1f1" : "transparent",
                  color: "#333",
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: "16px",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ fontSize: "18px" }}>{icon}</span>
                {sidebarOpen && <span>{label}</span>}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              marginBottom: "40px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarOpen ? "flex-start" : "center",
              gap: "12px",
              padding: "10px 12px",
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </aside>

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            padding: "30px",
            background: "#f7f9fc",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
