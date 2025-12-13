import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import VitalsCard from '../components/VitalsCard';
import { Activity, AlertTriangle } from 'lucide-react';

const DoctorVitals = () => {
  // Mock data for multiple patients
  const monitoredPatients = [
    { id: 1, name: 'Priyanshu Kumar', room: '304', status: 'Stable' },
    { id: 2, name: 'John Doe', room: '305', status: 'Critical' },
    { id: 3, name: 'Jane Smith', room: '306', status: 'Recovering' },
    { id: 4, name: 'Robert Brown', room: '307', status: 'Stable' },
  ];

  return (
    <DashboardLayout role="doctor">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity color="var(--primary)" size={32} /> Central Monitoring Station
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Live feed from Ward A • 4 Active Connections</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {monitoredPatients.map(patient => (
          <div key={patient.id} style={{ position: 'relative' }}>
            {patient.status === 'Critical' && (
               <div style={{ 
                 position: 'absolute', top: -10, right: 10, zIndex: 10, 
                 background: 'var(--danger)', color: 'white', padding: '0.25rem 0.75rem', 
                 borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, 
                 display: 'flex', alignItems: 'center', gap: '0.25rem',
                 boxShadow: '0 4px 12px rgba(248, 113, 113, 0.4)'
               }}>
                 <AlertTriangle size={12} /> CRITICAL
               </div>
            )}
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', borderBottom: 'none', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                   <h3 style={{ fontWeight: 600 }}>{patient.name}</h3>
                   <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Room {patient.room}</span>
                 </div>
                 <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: patient.status === 'Critical' ? 'var(--danger)' : 'var(--secondary)', boxShadow: `0 0 8px ${patient.status === 'Critical' ? 'var(--danger)' : 'var(--secondary)'}` }} />
               </div>
            </div>
            {/* Reusing VitalsCard but slightly modified context conceptually */}
            <div style={{ marginTop: '-1rem' }}>
              <VitalsCard />
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DoctorVitals;
