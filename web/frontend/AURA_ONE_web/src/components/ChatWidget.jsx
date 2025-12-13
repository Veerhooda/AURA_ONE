import React, { useState } from 'react';
import { MessageSquare, X, Send, Mic } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {isOpen ? (
        <div className="glass-panel" style={{ 
          width: '350px', 
          height: '500px', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '1rem', 
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(56, 189, 248, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%' }}></div>
              <span style={{ fontWeight: 600 }}>AURA Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <div style={{ 
                background: 'var(--bg-card)', 
                padding: '0.75rem', 
                borderRadius: '12px 12px 12px 0',
                fontSize: '0.9rem',
                border: '1px solid var(--glass-border)'
              }}>
                Hello! I'm your AURA health AI. How can I help you today?
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>10:00 AM</span>
            </div>
          </div>

          {/* Input Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              background: 'rgba(0,0,0,0.2)', 
              padding: '0.5rem', 
              borderRadius: '12px' 
            }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <Mic size={20} />
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                style={{ 
                  flex: 1, 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  outline: 'none',
                  fontSize: '0.9rem'
                }} 
              />
              <button style={{ background: 'var(--primary)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{ 
            borderRadius: '50%', 
            width: '60px', 
            height: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.5)'
          }}
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
