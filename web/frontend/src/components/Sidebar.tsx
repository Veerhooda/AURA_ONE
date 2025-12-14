import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NavItem {
    path: string;
    label: string;
    icon: any;
    end?: boolean;
}

interface SidebarProps {
    items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-slate-950/30 backdrop-blur-2xl border-r border-white/5 flex flex-col m-0 relative z-50">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-none">AURA</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">System One</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 mb-6">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 backdrop-blur-md">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                    ? "bg-primary/10 text-primary font-medium shadow-neon-blue border border-primary/20" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 hover:border hover:border-white/5"
              )
            }
          >
            {({ isActive }) => (
                <>
                    {/* Active Background Glow */}
                    {isActive && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary" 
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    
                    {/* Icon & Label */}
                    <div className="relative z-10 flex items-center gap-3">
                         <item.icon className={cn("w-5 h-5 transition-colors duration-300", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" : "text-slate-500 group-hover:text-slate-300")} />
                         <span className={cn("font-medium tracking-wide transition-colors duration-300", isActive ? "text-cyan-50" : "")}>{item.label}</span>
                    </div>
                </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-alert hover:bg-alert/10 rounded-xl transition-all duration-300 hover:shadow-neon-red"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
