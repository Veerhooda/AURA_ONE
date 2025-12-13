import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Calendar, FileText, Settings, Users, Video, LogOut } from 'lucide-react';

const Sidebar = ({ role }) => {
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
      { to: '/dashboard/doctor/consultations', icon: <Video size={20} />, label: 'Consultations' },
    ],
    family: [
      { to: '/dashboard/family', icon: <Activity size={20} />, label: 'Patient Status' },
      { to: '/dashboard/family/updates', icon: <FileText size={20} />, label: 'Updates' },
    ]
  };

  const roleLinks = links[role] || links.patient;

  return (
    <aside className="glass-panel" style={{ 
      width: '240px', 
      height: 'calc(100vh - 7rem)', 
      position: 'fixed', 
      top: '6rem', 
      left: '1rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
          {role.charAt(0).toUpperCase() + role.slice(1)} Portal
        </h3>
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
