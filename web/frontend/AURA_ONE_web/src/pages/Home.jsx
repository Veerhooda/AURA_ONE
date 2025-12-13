import React from 'react';
import { Activity, Shield, Cpu, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '6rem 0 0 0' }}>
      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', padding: '4rem 1rem 6rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: 'var(--primary)', 
            padding: '0.5rem 1rem', 
            borderRadius: '99px',
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            Revolutionizing Hospital Management
          </span>
        </div>
        
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 800, 
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          A Unified AI Operating System <br />
          <span className="text-gradient">For Modern Healthcare</span>
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.25rem', 
          maxWidth: '600px', 
          margin: '0 auto 3rem',
          lineHeight: 1.6
        }}>
          Experience the future of medical care with real-time patient digital twins, precise indoor navigation, and advanced AI assistance.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Get Started <ArrowRight size={18} />
            </button>
          </Link>
          <button style={{ 
            background: 'transparent', 
            border: '1px solid var(--text-secondary)', 
            color: 'var(--text-primary)',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            View Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--bg-card)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Key Features</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Everything you need to manage hospital operations efficiently.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <FeatureCard 
              icon={<Activity size={32} color="var(--secondary)" />}
              title="Real-time Vitals"
              description="Sub-second latency streaming of ECG, SpO2, and BP directly from patients to the dashboard."
            />
            <FeatureCard 
              icon={<Shield size={32} color="var(--accent)" />}
              title="Patient Digital Twin"
              description="Live 3D-style health visualization syncing patient data across all devices."
            />
            <FeatureCard 
              icon={<Cpu size={32} color="var(--primary)" />}
              title="AI Assistant"
              description="Intelligent voice and text chat for instant medical queries and hospital navigation."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.2s' }}>
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      width: '64px', 
      height: '64px', 
      borderRadius: '16px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: '1.5rem'
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
  </div>
);

export default Home;
