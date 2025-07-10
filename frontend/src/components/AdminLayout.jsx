import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <nav style={{ width: "220px", background: "#f4f4f4", padding: "20px" }}>
        <h2>Admin Menu</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/admin/dashboard" className={location.pathname.includes("dashboard") ? "active" : ""}>Dashboard</Link></li>
          <li><Link to="/admin/issues" className={location.pathname.includes("issues") ? "active" : ""}>Issues Ticket</Link></li>
          <li><Link to="/admin/my-requests" className={location.pathname.includes("my-requests") ? "active" : ""}>My Requests</Link></li>
          <li><Link to="/admin/users" className={location.pathname.includes("users") ? "active" : ""}>User Accounts</Link></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;