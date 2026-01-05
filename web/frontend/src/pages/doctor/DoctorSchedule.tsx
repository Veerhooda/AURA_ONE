import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, MoreVertical, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type ViewMode = 'day' | 'week' | 'month';

interface Event {
    id: string;
    title: string;
    type: 'OPD' | 'SURGERY' | 'ROUNDS' | 'MEETING';
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    patient?: string;
    location: string;
    day: number; // 1-7 for week view mock
    date?: string; // YYYY-MM-DD
}

const DoctorSchedule = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Events
    const events: Event[] = [
        { id: '1', title: 'Morning Rounds', type: 'ROUNDS', startTime: '08:00', endTime: '09:30', location: 'Ward A, B', day: 1 },
        { id: '2', title: 'OPD Consultation', type: 'OPD', startTime: '10:00', endTime: '13:00', location: 'Consultation Room 4', day: 1 },
        { id: '3', title: 'Surgery: Appendectomy', type: 'SURGERY', startTime: '14:00', endTime: '16:00', patient: 'John Doe', location: 'OT-2', day: 1 },
        { id: '4', title: 'Department Meeting', type: 'MEETING', startTime: '16:30', endTime: '17:30', location: 'Conf Room B', day: 1 },
        
        { id: '5', title: 'Morning Rounds', type: 'ROUNDS', startTime: '08:00', endTime: '09:00', location: 'Ward A', day: 2 },
        { id: '6', title: 'OPD Consultation', type: 'OPD', startTime: '09:30', endTime: '12:30', location: 'Consultation Room 4', day: 2 },
        { id: '7', title: 'Surgery: Knee Replacement', type: 'SURGERY', startTime: '13:00', endTime: '17:00', patient: 'Mrs. Sharma', location: 'OT-1', day: 2 },
    ];

    const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getEventColor = (type: string) => {
        switch (type) {
            case 'OPD': return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
            case 'SURGERY': return 'bg-alert/10 border-alert/20 text-alert';
            case 'ROUNDS': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'MEETING': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
            default: return 'bg-slate-700/50 border-slate-600';
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Schedule & Appointments</h1>
                    <p className="text-slate-400 mt-1">Manage consultations, surgeries, and daily rounds.</p>
                </div>

                <div className="flex items-center gap-4">
                     <div className="flex items-center bg-slate-900/50 rounded-lg p-1 border border-slate-800">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-8 px-3 rounded-md", viewMode === 'day' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
                            onClick={() => setViewMode('day')}
                        >
                            Day
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-8 px-3 rounded-md", viewMode === 'week' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
                            onClick={() => setViewMode('week')}
                        >
                            Week
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn("h-8 px-3 rounded-md", viewMode === 'month' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white")}
                            onClick={() => setViewMode('month')}
                        >
                            Month
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-2 px-4 font-mono text-sm text-white">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            Oct 2025
                        </div>
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <Button className="gap-2 shadow-neon-blue">
                        <Plus className="w-4 h-4" /> New Appointment
                    </Button>
                </div>
            </div>

            {/* Main Calendar Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Calendar Grid */}
                <GlassPanel className="flex-1 p-0 overflow-hidden flex flex-col">
                    {/* Days Header */}
                    <div className="grid grid-cols-8 border-b border-white/10 shrink-0 bg-white/5">
                        <div className="p-4 border-r border-white/10"></div> {/* Time Col */}
                        {weekDays.map((day, i) => (
                            <div key={day} className="p-4 text-center border-r border-white/5 last:border-0">
                                <div className="text-xs font-bold text-slate-500 uppercase">{day}</div>
                                <div className={cn(
                                    "mt-1 text-sm font-bold",
                                    i === 0 ? "text-primary bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center mx-auto" : "text-white"
                                )}>
                                    {14 + i}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Scrollable Time Grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                         <div className="grid grid-cols-8">
                            {/* Time Column */}
                            <div className="border-r border-white/10 bg-slate-900/30">
                                {timeSlots.map(hour => (
                                    <div key={hour} className="h-24 border-b border-white/5 p-2 text-xs text-slate-500 font-mono text-right relative">
                                        <span className="-top-2.5 right-2 absolute">{hour}:00</span>
                                    </div>
                                ))}
                            </div>

                            {/* Days Columns */}
                            {weekDays.map((day, colIndex) => (
                                <div key={day} className="border-r border-white/5 relative">
                                    {/* Grid Lines */}
                                    {timeSlots.map(hour => (
                                        <div key={hour} className="h-24 border-b border-white/5" />
                                    ))}

                                    {/* Events Overlay */}
                                    {events.filter(e => e.day === colIndex + 1).map(event => {
                                        // Simple positioning logic for demo
                                        const startHour = parseInt(event.startTime.split(':')[0]);
                                        const top = (startHour - 8) * 6 + ((parseInt(event.startTime.split(':')[1]) / 60) * 6); // 6rem per hour (h-24)
                                        const durationExec = parseInt(event.endTime.split(':')[0]) - startHour + (parseInt(event.endTime.split(':')[1]) - parseInt(event.startTime.split(':')[1])) / 60;
                                        const height = durationExec * 6; // h-24 = 6rem

                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                key={event.id}
                                                className={cn(
                                                    "absolute inset-x-1 p-2 rounded-lg border text-xs cursor-pointer hover:shadow-lg hover:z-10 transition-all",
                                                    getEventColor(event.type)
                                                )}
                                                style={{ top: `${top}rem`, height: `${height}rem` }}
                                            >
                                                <div className="font-bold truncate">{event.title}</div>
                                                <div className="flex items-center gap-1 mt-1 opacity-80 truncate">
                                                    <Clock className="w-3 h-3" /> {event.startTime} - {event.endTime}
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-1 mt-0.5 opacity-80 truncate">
                                                        <MapPin className="w-3 h-3" /> {event.location}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                         </div>
                         
                         {/* Current Time Line Mock */}
                         <div className="absolute left-0 right-0 top-[18rem] border-t border-primary/50 z-20 pointer-events-none">
                            <div className="absolute -top-1.5 left-0 w-2 h-2 rounded-full bg-primary" />
                         </div>
                    </div>
                </GlassPanel>

                {/* Sidebar Agenda */}
                <div className="w-80 shrink-0 space-y-6 flex flex-col">
                    <GlassPanel className="shrink-0 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <CalendarIcon className="w-20 h-20 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Up Next</h3>
                        
                        <div className="relative z-10">
                            <div className="text-2xl font-bold text-white mb-1">10:00 AM</div>
                            <div className="text-lg font-medium text-primary mb-2">OPD Consultation</div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <MapPin className="w-4 h-4 text-slate-500" /> Room 4, Block B
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                                <User className="w-4 h-4 text-slate-500" /> 12 Patients Waiting
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                             <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                                Start Session
                             </Button>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="flex-1 flex flex-col p-4 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Today's Agenda</h3>
                            <span className="text-xs text-slate-500">Oct 14</span>
                        </div>
                        
                        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
                            {events.filter(e => e.day === 1).map((event, i) => (
                                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge className={cn("text-[10px] px-1.5 py-0 h-4 border-0 bg-transparent pl-0", getEventColor(event.type).replace('bg-', 'text-').split(' ')[0])}>
                                            {event.type}
                                        </Badge>
                                        <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="font-medium text-sm text-white mb-1">{event.title}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Clock className="w-3 h-3" /> {event.startTime}
                                        {event.patient && (
                                            <>
                                                <span>•</span>
                                                <User className="w-3 h-3" /> {event.patient}
                                            </>
                                        )}
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

export default DoctorSchedule;
