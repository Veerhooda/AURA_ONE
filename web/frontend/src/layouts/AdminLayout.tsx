import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LayoutGrid, Users, Settings, Database, Shield } from 'lucide-react';

const AdminLayout = () => {
    const navItems = [
        { path: '/admin', label: 'Hospital Overview', icon: LayoutGrid, end: true },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/records', label: 'Medical Records', icon: Database },
        { path: '/admin/security', label: 'Security & Audit', icon: Shield },
        { path: '/admin/settings', label: 'System Settings', icon: Settings },
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

export default AdminLayout;
