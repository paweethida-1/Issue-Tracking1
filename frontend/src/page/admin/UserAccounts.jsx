import React, { useEffect, useState } from "react";

const UserAccounts = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name || "",
      department: user.department || "",
      email: user.email || "",
      password: "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Update failed");
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Role update failed");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id, currentEnabled) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !currentEnabled }),
      });
      if (!res.ok) throw new Error("Status update failed");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Delete failed");
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // style for centered text and vertical alignment middle
  const cellStyle = {
    textAlign: "center",
    verticalAlign: "middle",
    padding: "12px 10px",
    border: "1px solid #ddd",
  };

  const headerStyle = {
    ...cellStyle,
    backgroundColor: "#1f2d3d",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", color: "#1f2d3d" }}>User Accounts</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 4px 10px rgb(0 0 0 / 0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Name</th>
            <th style={headerStyle}>Department</th>
            <th style={headerStyle}>Email</th>
            <th style={headerStyle}>Password</th>
            <th style={headerStyle}>Role</th>
            <th style={headerStyle}>Status</th>
            <th style={headerStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              style={{
                backgroundColor: editingUserId === u.id ? "#f0f8ff" : "white",
                transition: "background-color 0.3s",
              }}
            >
              <td style={cellStyle}>
                {editingUserId === u.id ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ width: "90%", padding: "6px" }}
                  />
                ) : (
                  u.name
                )}
              </td>
              <td style={cellStyle}>
                {editingUserId === u.id ? (
                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={{ width: "90%", padding: "6px" }}
                  />
                ) : (
                  u.department
                )}
              </td>
              <td style={cellStyle}>
                {editingUserId === u.id ? (
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ width: "90%", padding: "6px" }}
                  />
                ) : (
                  u.email
                )}
              </td>
              <td style={cellStyle}>
                {editingUserId === u.id ? (
                  <input
                    type="password"
                    name="password"
                    placeholder="Change password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    style={{ width: "90%", padding: "6px" }}
                  />
                ) : (
                  "••••••••"
                )}
              </td>
              <td style={cellStyle}>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  disabled={editingUserId === u.id}
                  style={{ padding: "6px", width: "90%" }}
                >
                  <option value="USER">USER</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="ADMIN_STAFF">ADMIN_STAFF</option>
                </select>
              </td>
              <td style={cellStyle}>
                <button
                  onClick={() => handleToggleStatus(u.id, u.enabled)}
                  style={{
                    backgroundColor: u.enabled ? "#2ecc71" : "#e74c3c",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                  title={u.enabled ? "Enabled (Click to disable)" : "Disabled (Click to enable)"}
                  aria-label={u.enabled ? "Enabled" : "Disabled"}
                >
                  {u.enabled ? "✓" : "✗"}
                </button>
              </td>
              <td style={cellStyle}>
                {editingUserId === u.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(u.id)}
                      style={{
                        marginRight: "8px",
                        padding: "6px 14px",
                        backgroundColor: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#b0b0b0",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(u)}
                      style={{
                        marginRight: "8px",
                        padding: "6px 14px",
                        backgroundColor: "#f59e0b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAccounts;
