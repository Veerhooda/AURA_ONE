import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import ChatInterface from '@/components/family/ChatInterface';
import { Clock, Activity, Calendar, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const DoctorUpdates = () => {
    const dailyBrief = {
        date: 'Today, Oct 14',
        doctorName: 'Dr. Sarah Wilson',
        summary: "Patient had a restful night. Blood pressure has stabilized (120/80). We are tapering off the IV antibiotics as the infection markers have come down significantly. Physical therapy is scheduled for the afternoon.",
        status: 'Improving',
        nextReview: '5:00 PM'
    };

    const timelineEvents = [
        { time: '11:30 AM', title: 'Lunch Served', desc: 'Patient followed the prescribed low-sodium diet.', icon: CheckCircle2, color: 'text-emerald-400' },
        { time: '10:00 AM', title: 'Morning Rounds', desc: 'Dr. Sarah reviewed charts. Vitals are stable.', icon: Stethoscope, color: 'text-sky-400' },
        { time: '08:45 AM', title: 'Medication Administered', desc: 'Morning dose of antibiotics and multivitamins.', icon: Activity, color: 'text-purple-400' },
        { time: '07:30 AM', title: 'Blood Sample Collected', desc: 'Routine CBC and electrolytes check.', icon: FileText, color: 'text-orange-400' },
    ];

    const upcomingEvents = [
        { time: '02:00 PM', title: 'Physical Therapy Session', type: 'Therapy' },
        { time: '05:00 PM', title: 'Evening Rounds', type: 'Review' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Doctor Updates</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Timeline & Brief (Takes 2/3 space) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Daily Brief Card */}
                    <GlassPanel className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-sky-400" /> Daily Round Summary
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">{dailyBrief.date} • by {dailyBrief.doctorName}</p>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                Status: {dailyBrief.status}
                            </Badge>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 mb-4 relative z-10">
                            <p className="text-slate-200 leading-relaxed text-sm">
                                "{dailyBrief.summary}"
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Clock className="w-3 h-3" /> Next Review scheduled for {dailyBrief.nextReview}
                        </div>
                    </GlassPanel>

                    {/* Timeline */}
                    <GlassPanel>
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-400" /> Care Timeline
                        </h2>
                        
                        <div className="relative pl-8 border-l border-white/10 space-y-8">
                            {timelineEvents.map((event, i) => (
                                <div key={i} className="relative group">
                                    {/* Dot */}
                                    <div className={cn(
                                        "absolute -left-[37px] w-4 h-4 rounded-full border-2 border-slate-950 box-content transition-all group-hover:scale-125",
                                        i === 0 ? "bg-primary shadow-[0_0_10px_2px_rgba(0,242,255,0.3)]" : "bg-slate-700"
                                    )} />
                                    
                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-2 rounded-lg bg-white/5", event.color)}>
                                            <event.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-mono text-slate-500">{event.time}</span>
                                            <h4 className="text-white font-medium">{event.title}</h4>
                                            <p className="text-slate-400 text-sm mt-0.5">{event.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>

                     {/* Upcoming Schedule (Mobile/Small nested, but could be separate) */}
                     <GlassPanel>
                        <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-400" /> Upcoming
                        </h3>
                        <div className="space-y-3">
                            {upcomingEvents.map((ev, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">
                                        {ev.time}
                                    </div>
                                    <div className="text-sm text-slate-200">{ev.title}</div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>
                </div>

                {/* Right Column: Chat (Takes 1/3 space) */}
                <div className="space-y-6">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};

export default DoctorUpdates;
