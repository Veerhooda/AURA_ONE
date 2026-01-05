import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import VisitorPass from '@/components/family/VisitorPass';
import { Clock, Users, ShieldAlert, Info, MapPin } from 'lucide-react';

const VisitingHours = () => {
    // Mock Data
    const status = {
        isOpen: true,
        nextClose: '2h 15m',
        capacity: 'Moderate',
        nextOpen: 'Tomorrow, 10:00 AM'
    };

    const policies = [
        { icon: ShieldAlert, text: 'Masks are mandatory', color: 'text-orange-400' },
        { icon: Users, text: 'Max 2 visitors per patient', color: 'text-sky-400' },
        { icon: Clock, text: 'Max duration: 45 mins', color: 'text-purple-400' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Visiting Access</h1>

            {/* Top Status Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <GlassPanel className="bg-emerald-500/5 border-emerald-500/20 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 animate-pulse">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-emerald-400 uppercase tracking-wider">Current Status</div>
                        <div className="text-2xl font-bold text-white">Open Now</div>
                        <div className="text-xs text-slate-400">Closes in {status.nextClose}</div>
                    </div>
                 </GlassPanel>

                 <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-800 text-sky-400">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                         <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Ward Capacity</div>
                        <div className="text-2xl font-bold text-white">{status.capacity}</div>
                        <div className="text-xs text-slate-400">Traffic Level</div>
                    </div>
                 </GlassPanel>

                 <GlassPanel className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-slate-800 text-purple-400">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Location</div>
                        <div className="text-2xl font-bold text-white">ICU - West Wing</div>
                        <div className="text-xs text-slate-400">Floor 3, Block B</div>
                    </div>
                 </GlassPanel>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Pass Display */}
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white mb-6 w-full text-center">Your Digital Pass</h2>
                    <div className="w-full max-w-sm">
                        <VisitorPass 
                            visitorName="James Smith"
                            patientName="Jane Smith"
                            ward="ICU - West Wing"
                            validUntil="Today, 12:00 PM"
                        />
                    </div>
                </div>

                {/* Right: Guidelines & History */}
                <div className="space-y-8">
                    <GlassPanel>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                             <Info className="w-5 h-5 text-sky-400" /> Policy Guidelines
                        </h2>
                         <div className="grid gap-4">
                            {policies.map((policy, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <policy.icon className={`w-5 h-5 ${policy.color}`} />
                                    <span className="text-slate-200 font-medium">{policy.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs text-red-200 flex gap-2">
                                <ShieldAlert className="w-4 h-4 shrink-0" />
                                Please sanitize your hands before entering the ward. Do not visit if you have flu-like symptoms.
                            </p>
                        </div>
                    </GlassPanel>

                    <GlassPanel>
                         <h2 className="text-lg font-bold text-white mb-4">Recent Visits</h2>
                         <div className="space-y-4">
                            {[
                                { date: 'Yesterday', duration: '40 mins', time: '10:00 AM - 10:40 AM' },
                                { date: 'Oct 12', duration: '35 mins', time: '05:00 PM - 05:35 PM' },
                            ].map((visit, i) => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <div className="text-white font-medium">{visit.date}</div>
                                        <div className="text-xs text-slate-500">{visit.time}</div>
                                    </div>
                                    <div className="font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded text-xs">
                                        {visit.duration}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default VisitingHours;
