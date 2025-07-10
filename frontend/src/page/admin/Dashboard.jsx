import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/request", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const total = data.length;
        const open = data.filter((r) => r.status === "PENDING").length;
        const inProgress = data.filter((r) => r.status === "IN_PROGRESS").length;
        const resolved = data.filter((r) => r.status === "COMPLETED").length;

        setStats({ total, open, inProgress, resolved });
      })
      .catch((err) => console.error("Dashboard error:", err));
  }, []);

  return (
    <div>
      <h2>📊 Dashboard Summary</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <StatCard label="Total Issues" value={stats.total} color="#34495e" />
        <StatCard label="Open Issues" value={stats.open} color="#e67e22" />
        <StatCard label="In Progress" value={stats.inProgress} color="#f1c40f" />
        <StatCard label="Resolved" value={stats.resolved} color="#2ecc71" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div
    style={{
      background: color,
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "150px",
      textAlign: "center",
    }}
  >
    <h4>{label}</h4>
    <h2>{value}</h2>
  </div>
);

export default Dashboard;
