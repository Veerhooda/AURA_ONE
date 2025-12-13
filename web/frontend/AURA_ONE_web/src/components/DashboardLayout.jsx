import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children, role }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar - Fixed width */}
      <Sidebar role={role} />

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: '300px', // Matches Sidebar width (240px) + left (16px) + gap
        paddingTop: '6rem', // Push down for Navbar
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0 // Prevents flex child overflow
      }}>
        {/* Dashboard Header */}
        <header style={{ 
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          position: 'sticky',
          top: '6rem', // Sticks below the global floating navbar
          zIndex: 90,
          background: 'rgba(15, 23, 42, 0.8)', // Semi-transparent bg
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px',
            width: '300px'
          }}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ 
                background: 'transparent', 
                border: 'none', 
                outline: 'none', 
                color: 'white', 
                marginLeft: '0.5rem',
                width: '100%'
              }} 
            />
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} color="var(--text-secondary)" />
              <div style={{ 
                position: 'absolute', 
                top: -2, 
                right: -2, 
                width: 8, 
                height: 8, 
                background: 'var(--danger)', 
                borderRadius: '50%' 
              }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Priyanshu K.</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</div>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                PK
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
