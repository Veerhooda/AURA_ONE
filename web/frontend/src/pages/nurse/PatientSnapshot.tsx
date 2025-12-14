import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Users, AlertTriangle } from 'lucide-react';

const PatientSnapshot = () => {
    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-bold text-white tracking-tight">Assigned Patients</h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((_, i) => (
                    <GlassPanel key={i} hoverEffect className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white">Esther Howard</h3>
                                <p className="text-sm text-slate-400">Ward A - Bed 102</p>
                            </div>
                            <Badge variant={i === 0 ? "destructive" : "secondary"}>
                                {i === 0 ? "Critical" : "Stable"}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-800 border-b">
                            <div>
                                <span className="text-xs text-slate-500 uppercase">Heart Rate</span>
                                <div className="text-xl font-mono text-white">72 <span className="text-xs text-slate-500">bpm</span></div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 uppercase">SpO2</span>
                                <div className="text-xl font-mono text-white">98 <span className="text-xs text-slate-500">%</span></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 p-2 rounded">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Penicillin Allergy</span>
                             </div>
                             <div className="text-sm text-slate-400">
                                <span className="text-slate-500">Diet:</span> Low Sodium
                             </div>
                        </div>
                    </GlassPanel>
                ))}
             </div>
        </div>
    );
};

export default PatientSnapshot;
