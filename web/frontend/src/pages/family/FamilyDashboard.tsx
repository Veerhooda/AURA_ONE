import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Heart, Activity, CheckCircle } from 'lucide-react';

const FamilyDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-700">
                    JD
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">John Doe (Patient)</h1>
                    <p className="text-slate-400">Admitted: Dec 10, 2025 • Ward A, Bed 105</p>
                </div>
                <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-1.5 text-sm gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Condition Stable
                </Badge>
            </div>

            <GlassPanel className="p-8 border-l-4 border-l-sky-500">
                <h3 className="text-lg font-semibold text-white mb-4">Recovery Progress</h3>
                <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-[75%] bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.5)]"></div>
                </div>
                <div className="flex justify-between mt-2 text-sm text-slate-400">
                    <span>Admission</span>
                    <span className="text-white font-medium">75% Recovered</span>
                    <span>Discharge</span>
                </div>
            </GlassPanel>

            <div className="grid grid-cols-2 gap-6">
                <GlassPanel>
                    <div className="flex items-center gap-3 mb-4 text-emerald-400">
                        <Heart className="w-5 h-5" />
                        <h3 className="font-semibold">Vitals Summary</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Heart Rate</span>
                            <span className="text-white font-mono">72 bpm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Blood Pressure</span>
                            <span className="text-white font-mono">118/78</span>
                        </div>
                    </div>
                </GlassPanel>

                <GlassPanel>
                    <div className="flex items-center gap-3 mb-4 text-sky-400">
                        <Activity className="w-5 h-5" />
                        <h3 className="font-semibold">Latest Updates</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="mt-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-300">Morning medication administered.</p>
                                <p className="text-xs text-slate-500 mt-0.5">10:00 AM • Nurse Sarah</p>
                            </div>
                        </div>
                         <div className="flex gap-3">
                            <div className="mt-1">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-300">Physiotherapy session completed.</p>
                                <p className="text-xs text-slate-500 mt-0.5">09:15 AM • Dr. Patel</p>
                            </div>
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default FamilyDashboard;
