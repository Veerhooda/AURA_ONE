import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ClipboardList, Users, AlertCircle, Clock } from 'lucide-react';

const NurseLayout = () => {
    const navItems = [
        { path: '/nurse', label: 'My Tasks', icon: ClipboardList, end: true },
        { path: '/nurse/patients', label: 'Assigned Patients', icon: Users },
        { path: '/nurse/alerts', label: 'Emergency Alerts', icon: AlertCircle },
        { path: '/nurse/handover', label: 'Shift Handover', icon: Clock },
    ];

    return (
        <div className="flex bg-slate-950 min-h-screen">
            <Sidebar items={navItems} />
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-8 relative">
                <div className="max-w-7xl mx-auto space-y-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default NurseLayout;
