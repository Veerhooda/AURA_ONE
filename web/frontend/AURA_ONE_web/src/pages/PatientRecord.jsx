import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { 
  ArrowLeft, Activity, FileText, Calendar, Clock, 
  ChevronDown, ChevronUp, Share2, Printer, ClipboardList 
} from 'lucide-react';

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout role="doctor">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Navigation */}
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-secondary)', 
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={18} /> Back to List
        </button>

        {/* Patient Header Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 700, color: 'white'
            }}>
              PK
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Priyanshu Kumar</h1>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <span>ID: {id || '#A101'}</span>
                <span>•</span>
                <span>Male, 45 Yrs</span>
                <span>•</span>
                <span>Blood: O+</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }} title="Print Record">
              <Printer size={20} />
            </button>
            <button className="btn-secondary" style={{ padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }} title="Share Securely">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1px' }}>
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={Activity} />
          <TabButton active={activeTab === 'labs'} onClick={() => setActiveTab('labs')} label="Lab Results" icon={FileText} />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="History" icon={Calendar} />
        </div>

        {/* Content Area */}
        <div className="fade-in">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'labs' && <LabsTab />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Sub-components for Tabs

const OverviewTab = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Latest Vitals Snapshot</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <StatBox label="BP" value="120/80" unit="mmHg" status="normal" />
        <StatBox label="HR" value="72" unit="bpm" status="normal" />
        <StatBox label="SpO2" value="98" unit="%" status="normal" />
        <StatBox label="Temp" value="36.6" unit="°C" status="normal" />
      </div>
    </div>
    
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Medications</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <MedItem name="Metoprolol" dose="50mg" freq="Once Daily" />
        <MedItem name="Aspirin" dose="75mg" freq="Once Daily" />
        <MedItem name="Atorvastatin" dose="20mg" freq="At Night" />
      </ul>
    </div>
  </div>
);

const LabsTab = () => (
  <div className="glass-panel" style={{ padding: '0' }}>
     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>Test Name</th>
            <th style={{ padding: '1rem' }}>Date</th>
            <th style={{ padding: '1rem' }}>Result</th>
            <th style={{ padding: '1rem' }}>Ref Range</th>
            <th style={{ padding: '1rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          <LabRow name="Complete Blood Count" date="12 Dec 2024" result="Normal" range="-" status="Normal" />
          <LabRow name="Hemoglobin A1c" date="10 Dec 2024" result="5.7%" range="< 5.7%" status="High" />
          <LabRow name="Lipid Panel" date="10 Dec 2024" result="Elevated LDL" range="< 100 mg/dL" status="Abnormal" />
        </tbody>
     </table>
  </div>
);

const HistoryTab = () => (
   <div className="glass-panel" style={{ padding: '2rem' }}>
     <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '2rem', position: 'relative' }}>
       <TimelineItem date="12 Dec 2024" title="Discharge Planned" desc="Patient stable. Scheduled for discharge in 24 hours." />
       <TimelineItem date="10 Dec 2024" title="Surgery - Appendectomy" desc="Successfull laparoscopic appendectomy. No complications." />
       <TimelineItem date="08 Dec 2024" title="Admitted" desc="Admitted via ER with acute abdominal pain." />
     </div>
   </div>
);

// Helper Components
const TabButton = ({ active, onClick, label, icon: Icon }) => (
  <button 
    onClick={onClick}
    style={{
      background: 'none', border: 'none', padding: '1rem 0.5rem', cursor: 'pointer',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
      fontWeight: active ? 600 : 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
      transition: 'all 0.2s'
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const StatBox = ({ label, value, unit, status }) => (
  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: status === 'normal' ? 'var(--secondary)' : 'var(--danger)' }}>
      {value} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{unit}</span>
    </div>
  </div>
);

const MedItem = ({ name, dose, freq }) => (
  <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
    <div>
      <div style={{ fontWeight: 600 }}>{name}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{dose}</div>
    </div>
    <div style={{ fontSize: '0.85rem', color: 'var(--primary)', alignSelf: 'center', background: 'rgba(56, 189, 248, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
      {freq}
    </div>
  </li>
);

const LabRow = ({ name, date, result, range, status }) => (
  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
    <td style={{ padding: '1rem', fontWeight: 500 }}>{name}</td>
    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{date}</td>
    <td style={{ padding: '1rem' }}>{result}</td>
    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{range}</td>
    <td style={{ padding: '1rem' }}>
       <span style={{ 
         color: status === 'Normal' ? 'var(--secondary)' : 'var(--danger)',
         background: status === 'Normal' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
         padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600
       }}>
         {status}
       </span>
    </td>
  </tr>
);

const TimelineItem = ({ date, title, desc }) => (
  <div style={{ marginBottom: '2rem', position: 'relative' }}>
    <div style={{ 
      position: 'absolute', left: '-2.4rem', top: '0.25rem', 
      width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)',
      border: '2px solid var(--bg-dark)'
    }} />
    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{date}</div>
    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h4>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

export default PatientRecord;
