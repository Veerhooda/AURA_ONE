import React from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { QrCode, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface VisitorPassProps {
    visitorName: string;
    patientName: string;
    ward: string;
    validUntil: string;
}

const VisitorPass: React.FC<VisitorPassProps> = ({ visitorName, patientName, ward, validUntil }) => {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <GlassPanel className="relative overflow-hidden flex flex-col items-center text-center p-8 bg-slate-900/80 backdrop-blur-xl border-white/10">
                {/* Header Band */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-emerald-500" />
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-1">E-PASS</h3>
                    <p className="text-xs text-slate-400 tracking-[0.2em] uppercase">AURA ONE HOSPITAL</p>
                </div>

                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-6 shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full border-2 border-dashed border-slate-900 flex items-center justify-center bg-slate-100">
                        <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                     <div className="absolute inset-x-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-white bg-black/50 px-2 py-1 rounded">
                        Scan at Gate 2
                    </div>
                </div>

                <div className="w-full space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Visitor</p>
                            <p className="text-white font-medium">{visitorName}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Patient</p>
                            <p className="text-white font-medium">{patientName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Destination</p>
                            <p className="text-white font-medium">{ward}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Valid Until</p>
                            <p className="text-emerald-400 font-mono font-bold">{validUntil}</p>
                        </div>
                    </div>
                </div>

                 <div className="absolute bottom-0 inset-x-0 py-2 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Active Pass</span>
                </div>
            </GlassPanel>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity justify-center">
                <Button size="sm" variant="outline" className="gap-2 text-xs h-8">
                    <Share2 className="w-3 h-3" /> Share
                </Button>
                <Button size="sm" variant="outline" className="gap-2 text-xs h-8">
                    <Download className="w-3 h-3" /> Save
                </Button>
            </div>
        </div>
    );
};

export default VisitorPass;
