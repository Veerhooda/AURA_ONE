import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Calendar, FileText, Settings, Users, Video, LogOut, X } from 'lucide-react';

const Sidebar = ({ role, isOpen, onClose }) => {
  const links = {
    patient: [
      { to: '/dashboard/patient', icon: <LayoutDashboard size={20} />, label: 'Overview' },
      { to: '/dashboard/patient/vitals', icon: <Activity size={20} />, label: 'My Vitals' },
      { to: '/dashboard/patient/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
      { to: '/dashboard/patient/records', icon: <FileText size={20} />, label: 'Records' },
    ],
    doctor: [
      { to: '/dashboard/doctor', icon: <Users size={20} />, label: 'Patient List' },
      { to: '/dashboard/doctor/schedule', icon: <Calendar size={20} />, label: 'Schedule' },
      { to: '/dashboard/doctor/vitals', icon: <Activity size={20} />, label: 'Live Monitor' }, // New Link
      { to: '/dashboard/doctor/consultations', icon: <Video size={20} />, label: 'Consultations' },
    ],
    family: [
      { to: '/dashboard/family', icon: <Activity size={20} />, label: 'Patient Status' },
      { to: '/dashboard/family/updates', icon: <FileText size={20} />, label: 'Updates' },
    ]
  };

  const roleLinks = links[role] || links.patient;

  return (
    <aside 
      className={`glass-panel ${isOpen ? 'mobile-open' : 'mobile-closed'}`}
      style={{ 
      width: '240px', 
      height: 'calc(100vh - 7rem)', 
      position: 'fixed', 
      top: '6rem', 
      left: '1rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      zIndex: 100,
      transition: 'transform 0.3s ease-in-out'
    }}>
      <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </h3>
        {/* Mobile Close Button */}
        <button className="mobile-only" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {roleLinks.map((link) => (
          <NavLink 
            key={link.to} 
            to={link.to}
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.2s',
              borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>



      {/* Live Alerts Widget for Doctors */}
      {role === 'doctor' && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
           <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <span style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--danger)' }}></span>
             Critical Alerts
           </h4>
           <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
             2 Patients require attention in Ward A.
           </div>
        </div>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <NavLink 
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem'
          }}
        >
          <Settings size={20} />
          Settings
        </NavLink>
        <NavLink 
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            color: 'var(--danger)',
            fontWeight: 500
          }}
        >
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
