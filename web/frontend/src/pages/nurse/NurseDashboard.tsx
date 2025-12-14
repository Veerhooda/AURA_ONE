import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, Clock, Droplet, Pill, Activity } from 'lucide-react';

interface Task {
    id: string;
    type: 'MEDICATION' | 'VITALS' | 'IV_DRIP' | 'ASSISTANCE';
    patientName: string;
    room: string;
    description: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    dueTime: string;
    isOverdue?: boolean;
}

const NurseDashboard = () => {
    const [tasks] = useState<Task[]>([
        { id: '1', type: 'IV_DRIP', patientName: 'Mr. Sharma', room: 'ICU-204', description: 'Replace Saline Drip', priority: 'CRITICAL', dueTime: 'Now', isOverdue: true },
        { id: '2', type: 'MEDICATION', patientName: 'Esther Howard', room: 'Ward-102', description: 'Administer Antibiotics (IV)', priority: 'HIGH', dueTime: '10:00 AM' },
        { id: '3', type: 'VITALS', patientName: 'Cameron Williamson', room: 'Ward-105', description: 'Check BP & SpO2', priority: 'MEDIUM', dueTime: '10:15 AM' },
        { id: '4', type: 'ASSISTANCE', patientName: 'Savannah Nguyen', room: 'Ward-104', description: 'Patient requested water', priority: 'MEDIUM', dueTime: '10:20 AM' },
    ]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'text-alert border-alert/50 bg-alert/5';
            case 'HIGH': return 'text-orange-500 border-orange-500/50 bg-orange-500/5';
            case 'MEDIUM': return 'text-sky-400 border-sky-400/50 bg-sky-400/5';
            default: return 'text-slate-400';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'MEDICATION': return <Pill className="w-5 h-5" />;
            case 'VITALS': return <Activity className="w-5 h-5" />;
            case 'IV_DRIP': return <Droplet className="w-5 h-5" />;
            default: return <CheckCircle className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                 <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Shift Tasks</h1>
                    <p className="text-slate-400 mt-1">AI-Prioritized • {tasks.filter(t => t.priority === 'CRITICAL').length} Critical Pending</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <Clock className="w-4 h-4" /> Shift Ends in 4h 30m
                </Button>
            </div>

            <div className="space-y-4">
                {tasks.map((task) => (
                    <GlassPanel 
                        key={task.id} 
                        hoverEffect
                        className={cn(
                            "flex items-center justify-between group border-l-4",
                            task.priority === 'CRITICAL' ? "border-l-alert" : "border-l-transparent"
                        )}
                    >
                        <div className="flex items-center gap-6">
                            <div className={cn("p-3 rounded-full border", getPriorityColor(task.priority))}>
                                {getIcon(task.type)}
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-white text-lg group-hover:text-primary transition-colors">
                                        {task.patientName}
                                    </h3>
                                    <Badge variant="outline" className="text-xs bg-slate-900/50 font-mono text-slate-400 border-slate-700">
                                        {task.room}
                                    </Badge>
                                    {task.isOverdue && (
                                        <Badge variant="destructive" className="animate-pulse">OVERDUE</Badge>
                                    )}
                                </div>
                                <p className="text-slate-400">{task.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Due</span>
                                <span className={cn("font-medium font-mono", task.priority === 'CRITICAL' ? "text-alert" : "text-white")}>
                                    {task.dueTime}
                                </span>
                            </div>
                            <Button className="w-32">Mark Done</Button>
                        </div>
                    </GlassPanel>
                ))}
            </div>
        </div>
    );
};

export default NurseDashboard;
