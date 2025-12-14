import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Activity, Stethoscope, Clipboard, ShieldAlert, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role: Role) => {
        await login(role);
        navigate(`/${role.toLowerCase()}`);
    };

    const roles: { id: Role, label: string, icon: any, color: string }[] = [
        { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope, color: 'text-sky-400' },
        { id: 'NURSE', label: 'Nurse', icon: Clipboard, color: 'text-emerald-400' },
        { id: 'ADMIN', label: 'Admin', icon: ShieldAlert, color: 'text-indigo-400' },
        { id: 'FAMILY', label: 'Family', icon: Users, color: 'text-pink-400' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute inset-0 bg-slate-950">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
                 <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] animate-pulse-fast"></div>
                 <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-fast" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md p-4"
            >
                <GlassPanel className="border-t border-white/10 shadow-2xl backdrop-blur-3xl">
                    <div className="text-center mb-10">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">AURA<span className="text-sky-400">ONE</span></h1>
                        <p className="text-slate-400 text-sm tracking-wide uppercase">Advanced Hospital Operating System</p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-center text-slate-500 text-xs uppercase tracking-widest mb-6">Select Access Level</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {roles.map((role) => (
                                <Button
                                    key={role.id}
                                    variant="glass"
                                    className="h-24 flex flex-col gap-3 hover:bg-white/5 border-white/5 hover:border-white/20 transition-all group"
                                    onClick={() => handleLogin(role.id)}
                                >
                                    <role.icon className={`w-6 h-6 ${role.color} group-hover:scale-110 transition-transform`} />
                                    <span className="text-slate-300 font-medium">{role.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-600">
                            Secure Access • End-to-End Encrypted • HIPAA Compliant
                        </p>
                    </div>
                </GlassPanel>
            </motion.div>
        </div>
    );
};

export default Login;
