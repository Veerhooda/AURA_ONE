import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import ECGWaveform from '@/components/ui/ECGWaveform';
import { Activity, Heart, Wind, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveMonitoring = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Live Operations Center</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient 1 - Critical */}
                <GlassPanel hoverEffect className="p-0 overflow-hidden border-alert/30 shadow-2xl shadow-neon-red/10 transition-all duration-500">
                    <div className="p-4 bg-alert/10 flex justify-between items-center border-b border-alert/20">
                        <div>
                            <h3 className="font-bold text-white text-lg">Bed 204 - ICU</h3>
                            <p className="text-xs text-red-300 font-mono tracking-wide">Mr. Sharma // CARDIAC_RISK</p>
                        </div>
                        <div className="animate-pulse flex items-center gap-2 px-3 py-1 bg-alert text-white text-xs font-bold rounded-full shadow-lg shadow-alert/50">
                            <Activity className="w-3 h-3" /> CRITICAL
                        </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2"><Heart className="w-3 h-3" /> Heart Rate</span>
                            <div className="text-4xl font-mono text-alert font-bold flex items-end gap-2 drop-shadow-md">
                                145 <span className="text-sm text-slate-500 mb-1 font-sans font-normal opacity-70">bpm</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2"><Wind className="w-3 h-3" /> SpO2</span>
                            <div className="text-4xl font-mono text-sky-400 font-bold flex items-end gap-2 drop-shadow-md">
                                92 <span className="text-sm text-slate-500 mb-1 font-sans font-normal opacity-70">%</span>
                            </div>
                        </div>
                        <div className="col-span-2">
                           <ECGWaveform color="text-alert" speed={2} type="critical" />
                        </div>
                    </div>
                </GlassPanel>

                {/* Patient 2 - Stable */}
                <GlassPanel hoverEffect className="p-0 overflow-hidden transition-all duration-500">
                    <div className="p-4 flex justify-between items-center border-b border-white/5 bg-slate-800/30">
                        <div>
                            <h3 className="font-bold text-white text-lg">Bed 102 - Ward A</h3>
                            <p className="text-xs text-slate-400 font-mono tracking-wide">Mrs. Verma // POST_OP</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                            STABLE
                        </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2"><Heart className="w-3 h-3" /> Heart Rate</span>
                            <div className="text-4xl font-mono text-emerald-400 font-bold flex items-end gap-2">
                                72 <span className="text-sm text-slate-500 mb-1 font-sans font-normal opacity-70">bpm</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2"><Activity className="w-3 h-3" /> BP</span>
                            <div className="text-4xl font-mono text-white font-bold flex items-end gap-2">
                                120/82
                            </div>
                        </div>
                         <div className="col-span-2">
                           <ECGWaveform color="text-emerald-500" speed={1} type="normal" />
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default LiveMonitoring;
