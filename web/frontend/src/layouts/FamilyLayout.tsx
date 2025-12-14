import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Activity, Bell, Calendar, FileText } from 'lucide-react';

const FamilyLayout = () => {
    const navItems = [
        { path: '/family', label: 'Patient Status', icon: Activity, end: true },
        { path: '/family/updates', label: 'Doctor Updates', icon: Bell },
        { path: '/family/visiting', label: 'Visiting Hours', icon: Calendar },
        { path: '/family/consent', label: 'Consents', icon: FileText },
    ];

    return (
        <div className="flex bg-slate-950 min-h-screen">
            <Sidebar items={navItems} />
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950 p-8 relative">
                <div className="max-w-5xl mx-auto space-y-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default FamilyLayout;
