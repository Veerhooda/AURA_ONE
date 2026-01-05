import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import OPDQueue from './pages/doctor/OPDQueue';
import LiveMonitoring from './pages/doctor/LiveMonitoring';
import PatientRecords from './pages/doctor/PatientRecords';
import NurseLayout from './layouts/NurseLayout';
import NurseDashboard from './pages/nurse/NurseDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import PatientSnapshot from './pages/nurse/PatientSnapshot';
import ProfilePage from './pages/shared/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import SecurityAudit from './pages/admin/SecurityAudit';
import SystemSettings from './pages/admin/SystemSettings';
import FamilyLayout from './layouts/FamilyLayout';
import FamilyDashboard from './pages/family/FamilyDashboard';
import DoctorUpdates from './pages/family/DoctorUpdates';
import VisitingHours from './pages/family/VisitingHours';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor" element={<DoctorLayout />}>
               <Route index element={<DoctorDashboard />} />
               <Route path="opd" element={<OPDQueue />} />
               <Route path="monitoring" element={<LiveMonitoring />} />
               <Route path="patients" element={<PatientRecords />} />
               <Route path="schedule" element={<DoctorSchedule />} />
               <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['NURSE']} />}>
            <Route path="/nurse" element={<NurseLayout />}>
               <Route index element={<NurseDashboard />} />
               <Route path="patients" element={<PatientSnapshot />} />
               <Route path="alerts" element={<div className="text-white">Alerts</div>} />
               <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<AdminDashboard />} />
               <Route path="users" element={<UserManagement />} />
               <Route path="security" element={<SecurityAudit />} />
               <Route path="settings" element={<SystemSettings />} />
               <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['FAMILY']} />}>
            <Route path="/family" element={<FamilyLayout />}>
               <Route index element={<FamilyDashboard />} />
               <Route path="updates" element={<DoctorUpdates />} />
               <Route path="visiting" element={<VisitingHours />} />
               <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
