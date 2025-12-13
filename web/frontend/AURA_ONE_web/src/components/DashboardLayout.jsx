import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Settings, Menu, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children, role }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', overflowX: 'hidden' }}>
      {/* Mobile Backdrop */}
      {window.innerWidth <= 768 && isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{ 
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 95 
          }}
        />
      )}

      {/* Sidebar - Controlled */}
      <Sidebar role={role} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: window.innerWidth > 768 ? '300px' : '0', // Reactive Margin
        paddingTop: '6rem', 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0,
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        {/* Dashboard Header */}
        <header style={{ 
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 1rem', // Reduced padding for mobile
          position: 'sticky',
          top: '6rem', 
          zIndex: 90,
          background: 'rgba(15, 23, 42, 0.8)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--glass-border)',
          width: '100%' // Ensure full width
        }}>
          {/* Left: Menu & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <button 
              className="mobile-only" 
              onClick={() => setIsSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Menu size={24} />
            </button>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(255, 255, 255, 0.05)', 
              padding: '0.5rem 1rem', 
              borderRadius: '12px',
              width: '100%',
              maxWidth: '300px'
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
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={20} color="var(--text-secondary)" />
                <div style={{ 
                  position: 'absolute', top: -2, right: -2, width: 8, height: 8, 
                  background: 'var(--danger)', borderRadius: '50%' 
                }} />
              </button>
              
              {isNotificationsOpen && (
                <div className="glass-panel" style={{ 
                  position: 'absolute', top: '100%', right: 0, marginTop: '1rem', 
                  width: '300px', zIndex: 100, padding: '1rem', background: 'var(--bg-card)'
                }}>
                  <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Critical</span> Patient #A102 HR Alert
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Just now</div>
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>New</span> Lab results for #A105
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2 hours ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } }} className="desktop-only">
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Priyanshu K.</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</div>
                </div>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: 'white'
                }}>
                  PK
                </div>
              </button>

              {isProfileOpen && (
                <div className="glass-panel" style={{ 
                  position: 'absolute', top: '100%', right: 0, marginTop: '1rem', 
                  width: '200px', zIndex: 100, padding: '0.5rem', background: 'var(--bg-card)'
                }}>
                  <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <button style={{ 
                      width: '100%', padding: '0.75rem', border: 'none', background: 'transparent', 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer',
                      borderRadius: '8px'
                    }}>
                      <Settings size={16} /> Settings
                    </button>
                  </Link>
                   <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <button style={{ 
                      width: '100%', padding: '0.75rem', border: 'none', background: 'transparent', 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', cursor: 'pointer',
                      borderRadius: '8px'
                    }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: '2rem', flex: 1, overflowX: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
