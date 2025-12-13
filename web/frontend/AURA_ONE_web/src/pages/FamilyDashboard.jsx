import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Clock, MessageCircle, Activity, CheckCircle } from 'lucide-react';
import ChatWidget from '../components/ChatWidget'; // Family can also use chat

const FamilyDashboard = () => {
  return (
    <DashboardLayout role="family">
      <ChatWidget />
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Family Updates</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Tracking: Priyanshu Kumar (Room 304)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Navigation Map Placeholder */}
        <div className="glass-panel" style={{ height: '500px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Indoor Navigation</h3>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem' }}>
               <MapPin size={16} /> Location: Ward A, Room 304
             </span>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Hospital Map & Pathfinding Visualization</p>
          </div>
        </div>

        {/* Timeline/Updates */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Updates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <UpdateItem 
              time="10:30 AM" 
              title="Morning Rounds Completed" 
              desc="Doctor visited. Recovery is progressing well. Vitals are stable." 
              icon={Clock} 
            />
             <UpdateItem 
              time="09:15 AM" 
              title="Breakfast Served" 
              desc="Patient finished subscribed meal plan." 
              icon={CheckCircle} 
            />
             <UpdateItem 
              time="Yesterday" 
              title="Surgery Successful" 
              desc="Procedure was completed without complications." 
              icon={Activity} 
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const UpdateItem = ({ time, title, desc, icon: Icon }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        background: 'var(--bg-card)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid var(--primary)'
      }}>
        {Icon ? <Icon size={16} color="var(--primary)" /> : <div style={{width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%'}} />}
      </div>
      <div style={{ width: '2px', flex: 1, background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>
    </div>
    <div style={{ paddingBottom: '1rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{time}</span>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: '0.25rem 0' }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

export default FamilyDashboard;
