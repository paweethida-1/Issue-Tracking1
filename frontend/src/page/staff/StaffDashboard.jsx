import React, { useEffect, useState } from "react";

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No auth token found, please login.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/request/assigned", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from server");
        }

        const total = data.length;
        const pending = data.filter((r) => r.status === "PENDING").length;
        const inProgress = data.filter((r) => r.status === "IN_PROGRESS").length;
        const completed = data.filter((r) => r.status === "COMPLETED").length;

        setStats({ total, pending, inProgress, completed });
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRequests();
  }, []);

  if (loading) return <div>Loading assigned requests...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>👷‍♂️ Staff Dashboard</h2>
      <p>สถิติคำร้องที่ได้รับมอบหมายให้ดำเนินการ</p>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <StatCard label="Total Assigned" value={stats.total} color="#34495e" />
        <StatCard label="Pending" value={stats.pending} color="#e67e22" />
        <StatCard label="In Progress" value={stats.inProgress} color="#f1c40f" />
        <StatCard label="Completed" value={stats.completed} color="#2ecc71" />
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
      minWidth: "140px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <h4>{label}</h4>
    <h2>{value}</h2>
  </div>
);

export default StaffDashboard;
