import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Users, Clock, Activity, AlertCircle, ArrowUpRight, FileText } from 'lucide-react';

const DoctorDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome, Dr. Priyanshu</h1>
                    <p className="text-slate-400 mt-1">Chief of Cardiology • Shift: 08:00 - 16:00</p>
                </div>
                <div className="flex gap-3">
                     <Badge variant="glass" className="px-3 py-1.5 text-sm gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Operational
                     </Badge>
                     <p className="text-slate-400 text-sm font-mono self-center">Dec 14, 2025</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'OPD Queue', value: '12', sub: '+4 new', icon: Users, color: 'text-sky-400', glow: 'shadow-neon-blue' },
                    { label: 'Critical Care', value: '3', sub: '1 Unstable', icon: Activity, color: 'text-alert', glow: 'shadow-neon-red' },
                    { label: 'Avg Wait Time', value: '14m', sub: '-2m vs avg', icon: Clock, color: 'text-emerald-400', glow: 'shadow-neon-green' },
                    { label: 'Pending Reports', value: '5', sub: 'Requires Review', icon: FileText, color: 'text-indigo-400', glow: 'shadow-indigo-500/50' },
                ].map((stat, i) => (
                    <GlassPanel key={i} hoverEffect className="relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <stat.icon className={`w-16 h-16 ${stat.color}`} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{stat.label}</span>
                            <div className="flex items-end gap-2">
                                <span className={`text-3xl font-bold text-white`}>{stat.value}</span>
                                <span className={`text-xs ${stat.color} mb-1.5 flex items-center gap-0.5`}>
                                    {stat.sub}
                                </span>
                            </div>
                        </div>
                    </GlassPanel>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Upcoming */}
                <div className="col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold text-white">Upcoming Patients</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <GlassPanel key={i} className="flex items-center justify-between group hover:border-sky-500/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                        EP
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium group-hover:text-sky-400 transition-colors">Esther Howard</h3>
                                        <p className="text-slate-500 text-sm">Chest Pain • Mild Severity</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <Badge variant="secondary" className="bg-sky-500/10 text-sky-400 border-sky-500/20">
                                        Check-in: 10:30 AM
                                    </Badge>
                                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>
                </div>

                {/* AI Insights */}
                <GlassPanel className="col-span-1 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-2 mb-6">
                         <div className="p-1.5 rounded bg-primary/20">
                            <Activity className="w-4 h-4 text-primary" />
                         </div>
                         <h2 className="font-semibold text-white">AI Shift Summary</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                            <span className="text-primary font-bold">Insight:</span> High volume of respiratory cases detected (35% above avg). 
                            Consider enabling "Respiratory Protocol" quick-actions.
                        </div>
                         <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-sm text-slate-300 leading-relaxed">
                            <span className="text-alert font-bold">Alert:</span> Bed 204 (ICU) showing erratic heart rate patterns. Predictive model suggests 85% risk of arrhythmia within 2 hours.
                        </div>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
};

export default DoctorDashboard;
