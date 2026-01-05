import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import AuditLogTable from '@/components/security/AuditLogTable';
import AccessMatrix from '@/components/security/AccessMatrix';
import { Shield, Lock, AlertTriangle, Smartphone, Globe, Monitor } from 'lucide-react';

const SecurityAudit = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Security & Audit</h1>
                    <p className="text-slate-400 mt-1">Monitor system integrity, track access logs, and manage permissions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                        <Shield className="w-4 h-4" /> System Secure
                    </span>
                    <Button variant="outline" className="border-alert text-alert hover:bg-alert/10">
                        <Lock className="w-4 h-4 mr-2" /> Lockdown Mode
                    </Button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassPanel className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-24 h-24 text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Threat Level</div>
                        <div className="text-3xl font-bold text-white mt-1">Low</div>
                        <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            No active threats detected
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe className="w-24 h-24 text-sky-500" />
                    </div>
                     <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Sessions</div>
                        <div className="text-3xl font-bold text-white mt-1">24</div>
                        <div className="text-xs text-slate-500 mt-2">
                             12 Active Users • 45 IPs Monitored
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel className="relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lock className="w-24 h-24 text-purple-500" />
                    </div>
                     <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Failed Logins</div>
                        <div className="text-3xl font-bold text-white mt-1">3</div>
                        <div className="text-xs text-slate-500 mt-2">
                             Last 24 hours (No brute force detected)
                        </div>
                    </div>
                </GlassPanel>
            </div>

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Audit Logs (Takes up 2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    <AuditLogTable />
                    <AccessMatrix />
                </div>

                {/* Right Column: Sessions & Alerts (Takes up 1/3) */}
                <div className="space-y-8">
                    {/* Active Sessions List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Active Sessions</h3>
                        <GlassPanel className="p-0 divide-y divide-white/5">
                            {[
                                { device: 'Chrome / Windows', ip: '192.168.1.45', location: 'Hospital Network', user: 'Dr. Sarah', icon: Monitor, current: true },
                                { device: 'Safari / iPhone 13', ip: '192.168.1.92', location: 'Hospital Wi-Fi', user: 'Nurse John', icon: Smartphone, current: false },
                                { device: 'Firefox / Mazda OS', ip: '45.12.33.1', location: 'Remote Access', user: 'Admin', icon: Monitor, current: false },
                            ].map((session, i) => (
                                <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                            <session.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white flex items-center gap-2">
                                                {session.device}
                                                {session.current && <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 rounded border border-sky-500/30">YOU</span>}
                                            </div>
                                            <div className="text-xs text-slate-500">{session.ip} • {session.location}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-alert text-xs">
                                        Revoke
                                    </Button>
                                </div>
                            ))}
                        </GlassPanel>
                    </div>

                    {/* Security Alerts */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Security Alerts</h3>
                        <GlassPanel className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">Suspicious Login Attempt</h4>
                                    <p className="text-xs text-slate-400 mt-1">Detected multiple failed attempts from IP 45.2.12.88. IP has been temporarily blocked.</p>
                                    <div className="mt-2 text-[10px] text-slate-500">2 hours ago</div>
                                </div>
                            </div>
                            
                            <div className="w-full h-px bg-white/5" />

                             <div className="flex gap-3">
                                <div className="mt-1">
                                    <Shield className="w-5 h-5 text-sky-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">System Patch Available</h4>
                                    <p className="text-xs text-slate-400 mt-1">Security patch v2.4.1 is ready for installation. Schedule maintenance.</p>
                                    <div className="mt-2 text-[10px] text-slate-500">5 hours ago</div>
                                </div>
                            </div>
                        </GlassPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityAudit;
