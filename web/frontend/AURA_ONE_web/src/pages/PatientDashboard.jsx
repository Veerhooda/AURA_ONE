import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import VitalsCard from '../components/VitalsCard';
import ChatWidget from '../components/ChatWidget';
import { Heart, Activity, Droplets, Thermometer } from 'lucide-react';

const PatientDashboard = () => {
  return (
    <DashboardLayout role="patient">
      <ChatWidget />
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Hello, Priyanshu</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Status: Stable • Last updated: Just now</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <VitalsCard 
          title="Heart Rate" 
          value="72" 
          unit="bpm" 
          status="Normal" 
          color="#F87171" 
          icon={Heart} 
          subtext="Variable range: 68-75 bpm"
        />
        <VitalsCard 
          title="Blood Pressure" 
          value="120/80" 
          unit="mmHg" 
          status="Normal" 
          color="#818CF8" 
          icon={Activity} 
          subtext="Systolic/Diastolic"
        />
        <VitalsCard 
          title="SpO2" 
          value="98" 
          unit="%" 
          status="Normal" 
          color="#34D399" 
          icon={Droplets} 
          subtext="Oxygen Saturation"
        />
        <VitalsCard 
          title="Temperature" 
          value="36.6" 
          unit="°C" 
          status="Normal" 
          color="#FBBF24" 
          icon={Thermometer} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Content Area - e.g. Charts */}
        <div className="glass-panel" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <p style={{ color: 'var(--text-secondary)' }}>Live ECG Waveform Visualization Placeholder</p>
        </div>

        {/* Side Panel - Appointments */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Upcoming</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AppointmentCard time="10:00 AM" doctor="Dr. Smith" type="General Checkup" />
            <AppointmentCard time="2:30 PM" doctor="Dr. Emily" type="Cardiology" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AppointmentCard = ({ time, doctor, type }) => (
  <div style={{ 
    background: 'rgba(255,255,255,0.03)', 
    padding: '1rem', 
    borderRadius: '12px',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  }}>
    <div style={{ 
      background: 'rgba(56, 189, 248, 0.1)', 
      padding: '0.5rem', 
      borderRadius: '8px', 
      textAlign: 'center',
      minWidth: '60px'
    }}>
      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{time}</span>
    </div>
    <div>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{doctor}</h4>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{type}</p>
    </div>
  </div>
);

export default PatientDashboard;
