import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LayoutDashboard, Users, HeartPulse, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorLayout = () => {
    const navItems = [
        { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/doctor/opd', label: 'OPD Queue', icon: Users },
        { path: '/doctor/monitoring', label: 'Live Monitoring', icon: HeartPulse },
        { path: '/doctor/patients', label: 'Patient Records', icon: FileText },
        { path: '/doctor/schedule', label: 'Schedule', icon: Calendar },
    ];

    return (
        <div className="flex min-h-screen relative">
            <Sidebar items={navItems} />
            <div className="flex-1 overflow-x-hidden overflow-y-auto p-0 relative">
                 {/* Top ambient glow */}
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30"></div>
                 
                 <div className="p-8 pb-32 min-h-full">
                    <Outlet />
                 </div>
            </div>
        </div>
    );
};

export default DoctorLayout;
