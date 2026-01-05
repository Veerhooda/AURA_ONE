import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AuditLog {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    resource: string;
    ip: string;
    status: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

const AuditLogTable = () => {
    const [logs] = useState<AuditLog[]>([
        { id: '1', timestamp: '2025-10-14 10:42:01', user: 'Dr. Sarah Wilson', action: 'View Patient Record', resource: 'Patient #8921', ip: '192.168.1.45', status: 'SUCCESS' },
        { id: '2', timestamp: '2025-10-14 10:38:15', user: 'Admin User', action: 'Update System Settings', resource: 'Global Config', ip: '192.168.1.10', status: 'SUCCESS' },
        { id: '3', timestamp: '2025-10-14 09:12:44', user: 'Unknown', action: 'Failed Login Attempt', resource: 'Auth Service', ip: '45.2.12.88', status: 'FAILURE' },
        { id: '4', timestamp: '2025-10-14 08:55:20', user: 'Nurse John Doe', action: 'Dispense Controlled Subst.', resource: 'Pharmacy Inv.', ip: '192.168.1.50', status: 'WARNING' },
        { id: '5', timestamp: '2025-10-14 08:30:00', user: 'System', action: 'Daily Backup', resource: 'Database', ip: 'Localhost', status: 'SUCCESS' },
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESS': return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Success</Badge>;
            case 'FAILURE': return <Badge className="bg-alert text-white shadow-neon-red border-alert"><ShieldAlert className="w-3 h-3 mr-1" /> Failure</Badge>;
            case 'WARNING': return <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Warning</Badge>;
            default: return null;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" /> Recent Activity Log
                </h3>
                <div className="flex gap-2">
                    <div className="relative w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input placeholder="Search logs..." className="pl-10 h-9" />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            <GlassPanel className="p-0 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                         <tr className="border-b border-white/10 text-xs text-slate-500 uppercase bg-white/5">
                            <th className="p-4 font-medium">Timestamp</th>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Action</th>
                            <th className="p-4 font-medium">Resource</th>
                            <th className="p-4 font-medium">IP Address</th>
                            <th className="p-4 font-medium text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4 text-slate-400 font-mono">{log.timestamp}</td>
                                <td className="p-4 font-medium text-white">{log.user}</td>
                                <td className="p-4 text-slate-300">{log.action}</td>
                                <td className="p-4 text-slate-400">{log.resource}</td>
                                <td className="p-4 text-slate-500 font-mono text-xs">{log.ip}</td>
                                <td className="p-4 text-right">
                                    {getStatusBadge(log.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>
        </div>
    );
};

export default AuditLogTable;
