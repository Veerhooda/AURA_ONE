import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <nav className="glass-panel" style={{ 
      position: 'fixed', 
      top: '1rem', 
      left: '50%', 
      transform: 'translateX(-50%)', 
      width: '90%', 
      maxWidth: '1280px', 
      zIndex: 1000,
      padding: '0.75rem 1.5rem',
      borderRadius: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
            padding: '0.5rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            AURA <span style={{ color: 'var(--primary)' }}>ONE</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden-mobile" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Home</Link>
          <Link to="/#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
          <Link to="/#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}>About</Link>
          
          <Link to={isDashboard ? "/" : "/login"}> {/* Logout goes home or specific logout route */}
            <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              {isDashboard ? 'Logout' : 'Login Portal'}
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="show-mobile" style={{ display: 'none' }}> 
          {/* Note: In a real responsive implementation, adding media queries to hiding/showing. 
             For now, keeping inline styles simple. You'd move this into CSS modules or standard CSS. 
          */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
