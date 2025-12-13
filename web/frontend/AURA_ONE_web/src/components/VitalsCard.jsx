import React from 'react';
import { Activity } from 'lucide-react';

const VitalsCard = ({ title, value, unit, status, color, icon: Icon, subtext }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '4px', 
        background: color 
      }}></div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ 
          background: `${color}20`, 
          padding: '0.5rem', 
          borderRadius: '10px',
          color: color 
        }}>
          {Icon ? <Icon size={20} /> : <Activity size={20} />}
        </div>
        {status && (
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            padding: '0.25rem 0.75rem', 
            borderRadius: '99px',
            background: status === 'Normal' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
            color: status === 'Normal' ? '#34D399' : '#F87171',
            border: `1px solid ${status === 'Normal' ? '#34D399' : '#F87171'}40`
          }}>
            {status}
          </span>
        )}
      </div>

      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
        {title}
      </h4>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {value}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {unit}
        </span>
      </div>
      
      {subtext && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          {subtext}
        </p>
      )}

      {/* Decorative waveform bg */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-10px', 
        right: '-10px', 
        opacity: 0.05
      }}>
        <Activity size={100} />
      </div>
    </div>
  );
};

export default VitalsCard;
