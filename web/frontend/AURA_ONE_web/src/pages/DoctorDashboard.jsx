import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Users, AlertCircle, CheckCircle, Plus, Edit2, Trash2, X, Save, FileText, ClipboardList } from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  // Mock Data State
  const [patients, setPatients] = useState([
    { id: '#A101', name: 'Priyanshu Kumar', condition: 'Post-Surgery', room: '304', status: 'Stable' },
    { id: '#A102', name: 'John Doe', condition: 'Arrhythmia', room: '305', status: 'Critical' },
    { id: '#A103', name: 'Jane Smith', condition: 'Observation', room: '306', status: 'Recovering' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ name: '', condition: '', room: '', status: 'Stable' });

  // Handlers
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', condition: '', room: '', status: 'Stable' });
    setIsModalOpen(true);
  };

  const handleEdit = (patient) => {
    setEditingId(patient.id);
    setFormData({ ...patient });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing
      setPatients(patients.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      // Create new
      const newId = '#A' + (Math.floor(Math.random() * 900) + 100);
      setPatients([...patients, { ...formData, id: newId }]);
    }
    setIsModalOpen(false);
  };

  const criticalCount = patients.filter(p => p.status === 'Critical').length;

  return (
    <DashboardLayout role="doctor">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Dr. Smith</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Shift: 08:00 - 16:00 • Ward A</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <StatBadge label="Total Patients" value={patients.length} icon={Users} color="var(--primary)" />
          <StatBadge label="Critical" value={criticalCount} icon={AlertCircle} color="var(--danger)" />
          <button 
            onClick={handleAddNew}
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: 'fit-content', alignSelf: 'center' }}
          >
            <Plus size={18} /> Add Patient
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Patient Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Condition</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Room</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <PatientRow 
                key={patient.id} 
                patient={patient} 
                onViewRecord={() => navigate(`/dashboard/doctor/record/${patient.id}`)}
                onViewReport={() => navigate(`/dashboard/doctor/report/${patient.id}`)}
                onEdit={() => handleEdit(patient)}
                onDelete={() => handleDelete(patient.id)}
              />
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No patients found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{editingId ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Condition</label>
                <input 
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Room</label>
                  <input 
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Status</label>
                  <select 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Stable">Stable</option>
                    <option value="Critical">Critical</option>
                    <option value="Recovering">Recovering</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Save Patient
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const StatBadge = ({ label, value, icon: Icon, color }) => (
  <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ background: `${color}20`, padding: '0.5rem', borderRadius: '8px', color: color }}>
      <Icon size={20} />
    </div>
    <div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  </div>
);

const PatientRow = ({ patient, onViewReport, onViewRecord, onEdit, onDelete }) => {
  const { name, id, condition, room, status } = patient;
  
  const getStatusColor = (s) => {
    if (s === 'Critical') return 'var(--danger)';
    if (s === 'Stable') return 'var(--secondary)';
    return 'var(--primary)';
  };

  return (
    <tr style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
      <td style={{ padding: '1rem', fontWeight: 500 }}>{name}</td>
      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{id}</td>
      <td style={{ padding: '1rem' }}>{condition}</td>
      <td style={{ padding: '1rem' }}>{room}</td>
      <td style={{ padding: '1rem' }}>
         <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            padding: '0.25rem 0.75rem', 
            borderRadius: '99px',
            background: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
            border: `1px solid ${getStatusColor(status)}40`
          }}>
            {status}
          </span>
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button 
            onClick={onViewRecord} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: '0.5rem' }} 
            title="Medical Record (PHR)"
          >
            <ClipboardList size={18} />
          </button>
          <button 
            onClick={onViewReport} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.5rem' }} 
            title="Doctor Notes"
          >
            <FileText size={18} />
          </button>
          <button 
            onClick={onEdit} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0.5rem' }} 
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={onDelete} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem' }} 
            title="Remove"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default DoctorDashboard;
