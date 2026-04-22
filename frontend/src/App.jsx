import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import Notifications from './pages/Notifications';
import StaffManagement from './pages/StaffManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* USER routes */}
      <Route element={<DashboardLayout allowedRoles={['USER']} />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/complaints/new" element={<NewComplaint />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<ChangePassword />} />
      </Route>

      {/* STAFF routes */}
      <Route element={<DashboardLayout allowedRoles={['STAFF']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/staff/notifications" element={<Notifications />} />
        <Route path="/staff/settings" element={<ChangePassword />} />
      </Route>

      {/* ADMIN routes */}
      <Route element={<DashboardLayout allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/settings" element={<ChangePassword />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;