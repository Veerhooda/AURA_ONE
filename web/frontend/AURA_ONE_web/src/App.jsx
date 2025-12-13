
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
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
  const location = useLocation();

  return (
    <div className="app-container">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/dashboard/patient*" element={<PageTransition><PatientDashboard /></PageTransition>} />
          <Route path="/dashboard/doctor*" element={<PageTransition><DoctorDashboard /></PageTransition>} />
          <Route path="/dashboard/doctor/report/:id" element={<PageTransition><PatientReport /></PageTransition>} />
          <Route path="/dashboard/doctor/record/:id" element={<PageTransition><PatientRecord /></PageTransition>} />
          <Route path="/dashboard/doctor/vitals" element={<PageTransition><DoctorVitals /></PageTransition>} />
          <Route path="/dashboard/family*" element={<PageTransition><FamilyDashboard /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
