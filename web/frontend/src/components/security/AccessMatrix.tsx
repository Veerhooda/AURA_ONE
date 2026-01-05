import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Check, X, Shield, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AccessMatrix = () => {
    const roles = ['Admin', 'Doctor', 'Nurse', 'Staff', 'Family'];
    const permissions = [
        { id: 1, name: 'View Patient Records', desc: 'Read access to medical history' },
        { id: 2, name: 'Edit Clinical Notes', desc: 'Modify patient diagnosis and checks' },
        { id: 3, name: 'Prescribe Medication', desc: 'Issue new prescriptions' },
        { id: 4, name: 'Manage Users', desc: 'Create and delete staff accounts' },
        { id: 5, name: 'View System Audit', desc: 'Access security logs' },
        { id: 6, name: 'Schedule Appointments', desc: 'Manage OPD queue' },
    ];

    // Initial State
    const [accessData, setAccessData] = useState<Record<string, boolean[]>>({
        'Admin':  [true, true, false, true, true, true],
        'Doctor': [true, true, true, false, false, true],
        'Nurse':  [true, false, false, false, false, true],
        'Staff':  [false, false, false, false, false, true],
        'Family': [false, false, false, false, false, false],
    });

    const [hasChanges, setHasChanges] = useState(false);

    const togglePermission = (role: string, index: number) => {
        setAccessData(prev => {
            const rolePerms = [...prev[role]];
            rolePerms[index] = !rolePerms[index];
            return {
                ...prev,
                [role]: rolePerms
            };
        });
        setHasChanges(true);
    };

    const handleSave = () => {
        // Here you would typically send the data to the backend
        setHasChanges(false);
        // Could trigger a toast notification here
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-400" /> Access Control Matrix (RBAC)
                </h3>
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                         <Button onClick={handleSave} size="sm" className="gap-2 shadow-neon-blue bg-primary/10 text-primary border-primary/50 hover:bg-primary/20">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </motion.div>
                )}
            </div>
            
            <GlassPanel className="p-0 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 min-w-[250px]">
                                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Permission</span>
                            </th>
                            {roles.map(role => (
                                <th key={role} className="p-4 text-center border-l border-white/5">
                                    <span className="text-sm font-bold text-slate-300">{role}</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {permissions.map((perm, index) => (
                            <tr key={perm.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-slate-200">{perm.name}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{perm.desc}</div>
                                </td>
                                {roles.map(role => (
                                    <td 
                                        key={role} 
                                        className="p-4 text-center border-l border-white/5 cursor-pointer group hover:bg-white/10 transition-colors"
                                        onClick={() => togglePermission(role, index)}
                                    >
                                        <div className="flex justify-center">
                                            {accessData[role][index] ? (
                                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-800/50 flex items-center justify-center opacity-30 group-hover:opacity-100 group-hover:bg-slate-700 transition-all">
                                                    <X className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>
        </div>
    );
};

// Helper Icon since ShieldCheck isn't exported by default in all lucide versions, using Shield for header
import { Shield as ShieldCheckIcon } from 'lucide-react';

export default AccessMatrix;
