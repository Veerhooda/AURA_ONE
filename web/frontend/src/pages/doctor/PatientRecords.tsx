import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '../../components/ui/Input';
import { Search, FileText } from 'lucide-react';

const PatientRecords = () => {
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Patient Records</h1>
                    <p className="text-slate-400 mt-1">Search and view patient medical history.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                        <Input 
                            type="text" 
                            placeholder="Search by ID or Name..." 
                            className="pl-10"
                        />
                    </div>
                </div>
            </div>

            <GlassPanel className="min-h-[400px] flex items-center justify-center text-slate-400 flex-col gap-4">
                 <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-black/20">
                    <FileText className="w-8 h-8 text-slate-400" />
                 </div>
                 <p>Select a patient to view detailed records</p>
            </GlassPanel>
        </div>
    );
};

export default PatientRecords;
