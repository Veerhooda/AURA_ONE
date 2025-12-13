import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Bell, Shield, Moon, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <DashboardLayout role="doctor"> 
      {/* Note: In a real app, role would be dynamic */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Settings</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Settings Sidebar */}
          <div className="glass-panel" style={{ padding: '1rem', height: 'fit-content' }}>
            <SettingsTab 
              icon={User} label="Profile" active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
            <SettingsTab 
              icon={Bell} label="Notifications" active={activeTab === 'notifications'} 
              onClick={() => setActiveTab('notifications')} 
            />
            <SettingsTab 
              icon={Shield} label="Security" active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')} 
            />
             <SettingsTab 
              icon={Moon} label="Appearance" active={activeTab === 'appearance'} 
              onClick={() => setActiveTab('appearance')} 
            />
          </div>

          {/* Settings Content */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Edit Profile</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700
                  }}>
                    PK
                  </div>
                  <button style={{ 
                    background: 'none', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)',
                    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer'
                  }}>
                    Change Photo
                  </button>
                </div>

                <form>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <InputGroup label="First Name" value="Priyanshu" />
                    <InputGroup label="Last Name" value="Kumar" />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <InputGroup label="Email" value="priyanshu@hospital.com" type="email" />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Bio</label>
                    <textarea 
                      rows="4"
                      style={{ 
                        width: '100%', padding: '0.75rem', borderRadius: '8px', 
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                        color: 'white', fontFamily: 'inherit'
                      }}
                      defaultValue="Senior Resident at AURA General."
                    />
                  </div>
                  <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Save size={18} /> Save Changes
                  </button>
                </form>
              </div>
            )}
            {activeTab !== 'profile' && (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                <p>This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const SettingsTab = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
      background: active ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      fontWeight: active ? 600 : 500, transition: 'all 0.2s',
      marginBottom: '0.25rem'
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const InputGroup = ({ label, value, type = "text" }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
    <input 
      type={type}
      defaultValue={value}
      style={{
        width: '100%', padding: '0.75rem', borderRadius: '8px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        color: 'white', outline: 'none'
      }}
    />
  </div>
);

export default Settings;
