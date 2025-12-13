import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Save, ArrowLeft, FileText, Activity, Clock } from 'lucide-react';

const PatientReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock initial data (normally fetched by ID)
  const [reportData, setReportData] = useState({
    name: 'Priyanshu Kumar',
    age: 45,
    gender: 'Male',
    bloodType: 'O+',
    history: 'Patient has a history of hypertension diagnosed in 2018. Underwent appendectomy in 2015. No known drug allergies.',
    diagnosis: 'Post-operative recovery from cardiac surgery. Stable but requires monitoring for arrhythmia.',
    treatment: 'Administering Beta-blockers (50mg OD). Daily ECG monitoring. Restricted physical activity for 2 weeks.',
    notes: 'Patient complains of mild dizziness upon standing. Vitals to be checked every 4 hours.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Report updated successfully!'); // Mock save
    // In real app, API call here
  };

  return (
    <DashboardLayout role="doctor">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-secondary)', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Medical Report</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Patient ID: {id || '#A101'} • <span style={{ color: 'var(--primary)' }}>Editable Mode</span></p>
          </div>
          <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={18} /> Save Report
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          {/* Main Form */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <form onSubmit={handleSave}>
              <SectionTitle icon={FileText} title="Medical History (Past Details)" />
              <textarea 
                rows="4"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '2rem', resize: 'vertical' }}
                value={reportData.history}
                onChange={(e) => setReportData({...reportData, history: e.target.value})}
              />

              <SectionTitle icon={Activity} title="Current Diagnosis" />
              <textarea 
                rows="3"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '2rem', resize: 'vertical' }}
                value={reportData.diagnosis}
                onChange={(e) => setReportData({...reportData, diagnosis: e.target.value})}
              />

              <SectionTitle icon={Clock} title="Treatment Plan" />
              <textarea 
                rows="3"
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', resize: 'vertical' }}
                value={reportData.treatment}
                onChange={(e) => setReportData({...reportData, treatment: e.target.value})}
              />
            </form>
          </div>

          {/* Side Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Patient Details</h3>
              <InfoRow label="Name" value={reportData.name} />
              <InfoRow label="Age" value={`${reportData.age} Years`} />
              <InfoRow label="Gender" value={reportData.gender} />
              <InfoRow label="Blood Type" value={reportData.bloodType} />
            </div>
            
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(56, 189, 248, 0.05)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>AI Insights</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Based on recent vitals, the patient shows signs of rapid recovery. Heart rate variability is stabilizing. Recommended to reduce beta-blocker dosage by 10% next week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <Icon size={20} color="var(--primary)" /> {title}
  </h3>
);

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value}</span>
  </div>
);

export default PatientReport;
