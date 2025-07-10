import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import selectedRole  from "./selectedRole ";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";

// Admin Pages
import Dashboard from "./page/admin/Dashboard";
import Issues from "./page/admin/Issues";
import IssueDetail from "./page/admin/IssueDetail";
import MyRequests from "./page/admin/MyRequests";
import CreateRequest from "./page/admin/CreateRequest";
import UserAccounts from "./page/admin/UserAccounts";

// Staff Pages
import StaffDashboard from "./page/staff/StaffDashboard";
import AssignedIssues from "./page/staff/AssignedIssues";
import StaffIssueDetail from "./page/staff/StaffIssueDetail";
import StaffCreateRequest from "./page/staff/StaffCreateRequest";
import MyStaffRequests from "./page/staff/MyRequests";
import SelectRole from "./selectedRole ";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />

        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="issues" element={<Issues />} />
          <Route path="issues/:id" element={<IssueDetail />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="my-requests/create" element={<CreateRequest />} />
          <Route path="users" element={<UserAccounts />} />
        </Route>

        {/* Staff Section */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="assigned-issues" element={<AssignedIssues />} />
          <Route path="issues/:id" element={<StaffIssueDetail />} />
          <Route path="my-requests/create" element={<StaffCreateRequest />} />
          <Route path="my-requests" element={<MyStaffRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
