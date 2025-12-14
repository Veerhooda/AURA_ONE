import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Activity, Users, AlertCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Hospital Command Center</h1>
            
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Total Admissions', value: '142', sub: '+12% vs last week', icon: Users, color: 'text-indigo-400' },
                    { label: 'Bed Occupancy', value: '87%', sub: 'Critical Level', icon: Activity, color: 'text-alert' },
                    { label: 'Active Alerts', value: '8', sub: '2 Unresolved', icon: AlertCircle, color: 'text-orange-400' },
                    { label: 'System Uptime', value: '99.9%', sub: 'No outages', icon: TrendingUp, color: 'text-emerald-400' },
                ].map((stat, i) => (
                    <GlassPanel key={i} hoverEffect className="relative overflow-hidden group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-slate-400 uppercase font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                                <p className={`text-xs mt-1 ${stat.color}`}>{stat.sub}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
                <GlassPanel className="h-96 flex items-center justify-center text-slate-500">
                    [Bed Availability Chart Placeholder]
                </GlassPanel>
                <GlassPanel className="h-96 flex items-center justify-center text-slate-500">
                    [Department Efficiency Chart Placeholder]
                </GlassPanel>
            </div>
        </div>
    );
};

export default AdminDashboard;
