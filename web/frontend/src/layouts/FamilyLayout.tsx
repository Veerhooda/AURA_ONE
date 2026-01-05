import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Activity, Bell, Calendar, User } from 'lucide-react';

const FamilyLayout = () => {
    const navItems = [
        { path: '/family', label: 'Patient Status', icon: Activity, end: true },
        { path: '/family/updates', label: 'Doctor Updates', icon: Bell },
        { path: '/family/visiting', label: 'Visiting Access', icon: Calendar },
        { path: '/family/profile', label: 'Profile', icon: User },

    ];

    return (
        <div className="flex bg-slate-950 h-screen">
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
