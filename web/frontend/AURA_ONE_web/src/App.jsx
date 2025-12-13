import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientReport from './pages/PatientReport';
import PatientRecord from './pages/PatientRecord';
import DoctorVitals from './pages/DoctorVitals';
import FamilyDashboard from './pages/FamilyDashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/patient*" element={<PatientDashboard />} />
          <Route path="/dashboard/doctor*" element={<DoctorDashboard />} />
          <Route path="/dashboard/doctor/report/:id" element={<PatientReport />} />
          <Route path="/dashboard/doctor/record/:id" element={<PatientRecord />} />
          <Route path="/dashboard/doctor/vitals" element={<DoctorVitals />} />
          <Route path="/dashboard/family*" element={<FamilyDashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
