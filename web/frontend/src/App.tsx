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
import PatientSnapshot from './pages/nurse/PatientSnapshot';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import FamilyLayout from './layouts/FamilyLayout';
import FamilyDashboard from './pages/family/FamilyDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/doctor" element={<DoctorLayout />}>
             <Route index element={<DoctorDashboard />} />
             <Route path="opd" element={<OPDQueue />} />
             <Route path="monitoring" element={<LiveMonitoring />} />
             <Route path="patients" element={<PatientRecords />} />
             <Route path="schedule" element={<div className="text-white">Schedule</div>} />
          </Route>

          <Route path="/nurse" element={<NurseLayout />}>
             <Route index element={<NurseDashboard />} />
             <Route path="patients" element={<PatientSnapshot />} />
             <Route path="alerts" element={<div className="text-white">Alerts</div>} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="users" element={<div className="text-white">Users</div>} />
          </Route>

          <Route path="/family" element={<FamilyLayout />}>
             <Route index element={<FamilyDashboard />} />
             <Route path="updates" element={<div className="text-white">Updates</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
