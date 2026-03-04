import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AddEmployee from "./pages/admin/AddEmployee";
import EmployeeList from "./pages/admin/EmployeeList";
import EditEmployee from "./pages/admin/EditEmployee";
import EmployeeAttendanceRecord from "./pages/admin/EmployeeAttendaceRecord";
import ViewEmployee from "./pages/admin/ViewEmployee";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-employee"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRole="admin">
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-employee/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <EditEmployee />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employee/:id/attendance"
        element={
          <ProtectedRoute allowedRole="admin">
            <EmployeeAttendanceRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employee/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <ViewEmployee />
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
