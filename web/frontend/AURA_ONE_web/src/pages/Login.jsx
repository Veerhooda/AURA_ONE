import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, Heart, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient'); // patient, doctor, family
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login - in real app would call API
    navigate(`/dashboard/${role}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '3rem',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your dashboard</p>
        </div>

        {/* Role Selection */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(0,0,0,0.2)', 
          padding: '0.25rem', 
          borderRadius: '12px',
          marginBottom: '2rem' 
        }}>
          <RoleButton 
            active={role === 'doctor'} 
            onClick={() => setRole('doctor')} 
            icon={<Stethoscope size={18} />}
            label="Doctor"
          />
          <RoleButton 
            active={role === 'patient'} 
            onClick={() => setRole('patient')} 
            icon={<User size={18} />}
            label="Patient"
          />
          <RoleButton 
            active={role === 'family'} 
            onClick={() => setRole('family')} 
            icon={<Heart size={18} />}
            label="Family"
          />
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="name@hospital.com"
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••••"
              />
              <Lock size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '12px', top: '12px' }} />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%' }}
          >
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
};

const RoleButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    style={{
      flex: 1,
      background: active ? 'var(--bg-card)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontWeight: 500,
      transition: 'all 0.2s'
    }}
  >
    {icon}
    {label}
  </button>
);

export default Login;
