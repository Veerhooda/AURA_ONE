import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Users, Clock, AlertCircle, Search, Filter, MoreVertical, ArrowRight } from 'lucide-react';

interface Patient {
    id: string;
    token: string;
    name: string;
    age: number;
    gender: string;
    symptoms: string[];
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    waitTime: string;
    status: 'WAITING' | 'IN_CONSULTATION' | 'COMPLETED';
}

const OPDQueue = () => {
    const [patients] = useState<Patient[]>([
        { id: '1', token: 'A-101', name: 'Robert Fox', age: 45, gender: 'M', symptoms: ['Chest Pain', 'Sweating'], severity: 'CRITICAL', waitTime: '2m', status: 'WAITING' },
        { id: '2', token: 'A-102', name: 'Savannah Nguyen', age: 28, gender: 'F', symptoms: ['High Fever', 'Chills'], severity: 'HIGH', waitTime: '15m', status: 'WAITING' },
        { id: '3', token: 'A-104', name: 'Esther Howard', age: 62, gender: 'F', symptoms: ['Joint Pain'], severity: 'MEDIUM', waitTime: '30m', status: 'WAITING' },
        { id: '4', token: 'A-105', name: 'Cameron Williamson', age: 35, gender: 'M', symptoms: ['Migraine'], severity: 'LOW', waitTime: '45m', status: 'WAITING' },
    ]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-alert text-white shadow-neon-red border-alert';
            case 'HIGH': return 'bg-orange-500 text-white shadow-neon-orange border-orange-500';
            case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">OPD Queue Management</h1>
                    <p className="text-slate-400 mt-1 flex items-center gap-2">
                        <Users className="w-4 h-4" /> Total Waiting: <span className="text-white font-mono">12</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search patient..." 
                            className="bg-slate-950/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* Queue List */}
            <div className="grid gap-4">
                {patients.map((patient) => (
                    <GlassPanel 
                        key={patient.id} 
                        hoverEffect 
                        className={cn(
                            "flex items-center justify-between transition-all group",
                            patient.severity === 'CRITICAL' && "border-l-4 border-l-alert bg-alert/5"
                        )}
                    >
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Token</div>
                                <div className="text-xl font-mono font-bold text-white bg-slate-800 rounded px-2 py-1 border border-slate-700">
                                    {patient.token}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors flex items-center gap-3">
                                    {patient.name}
                                    <Badge className={cn("text-[10px] px-2 py-0 h-5", getSeverityColor(patient.severity))}>
                                        {patient.severity}
                                    </Badge>
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                    <span>{patient.age} Y / {patient.gender}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                    <span className="text-slate-300">{patient.symptoms.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-end gap-1">
                                    <Clock className="w-3 h-3" /> Wait Time
                                </div>
                                <div className={cn(
                                    "font-mono font-medium",
                                    patient.waitTime.includes('m') && parseInt(patient.waitTime) > 30 ? "text-alert" : "text-white"
                                )}>
                                    {patient.waitTime}
                                </div>
                            </div>

                            <Button className="gap-2 group-hover:translate-x-1 transition-transform">
                                Call In <ArrowRight className="w-4 h-4" />
                            </Button>

                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
};

export default OPDQueue;
