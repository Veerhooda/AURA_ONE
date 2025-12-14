import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Captcha, { CaptchaHandle } from '@/components/ui/Captcha';
import { Activity, Mail, Lock, ShieldCheck, AlertCircle, Loader2, Stethoscope, Clipboard, ShieldAlert, Users, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    
    // State
    const [stage, setStage] = useState<'SELECTION' | 'FORM'>('SELECTION');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    const captchaRef = useRef<CaptchaHandle>(null);

    const roles: { id: Role, label: string, icon: any, color: string, description: string }[] = [
        { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope, color: 'text-sky-400', description: 'Access patient records & OPD' },
        { id: 'NURSE', label: 'Nurse', icon: Clipboard, color: 'text-emerald-400', description: 'Monitor vitals & tasks' },
        { id: 'ADMIN', label: 'Admin', icon: ShieldAlert, color: 'text-indigo-400', description: 'System management' },
        { id: 'FAMILY', label: 'Family', icon: Users, color: 'text-pink-400', description: 'Patient updates & reports' },
    ];

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        // Pre-fill email for convenience based on role
        setEmail(`${role.toLowerCase()}@aura.one`);
        setStage('FORM');
        setError(null);
    };

    const handleBack = () => {
        setStage('SELECTION');
        setSelectedRole(null);
        setError(null);
        setPassword('');
        setCaptchaInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // 1. Basic Validation
        if (!email || !password || !captchaInput) {
            setError("All fields are required.");
            return;
        }

        // 2. Captcha Validation
        if (captchaRef.current && !captchaRef.current.validate(captchaInput)) {
            setError("Invalid Captcha code. Please try again.");
            setCaptchaInput('');
            captchaRef.current.refresh();
            return;
        }

        // 3. Attempt Login
        try {
            await login(email, password);
             // Verify the entered email matches the selected role intent (Optional strict check)
             // For now we trust the login result
            navigate(`/${selectedRole?.toLowerCase() || 'doctor'}`); 
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
            if (captchaRef.current) {
                captchaRef.current.refresh();
                setCaptchaInput('');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute inset-0 bg-slate-950">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>
                 <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] animate-pulse-fast"></div>
                 <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px] animate-pulse-fast" style={{ animationDelay: '1s' }}></div>
            </div>

            <AnimatePresence mode="wait">
                {stage === 'SELECTION' ? (
                    <motion.div 
                        key="selection"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 w-full max-w-2xl p-4"
                    >
                        <GlassPanel className="border-t border-white/10 shadow-2xl backdrop-blur-3xl px-8 py-10">
                            <div className="text-center mb-10">
                                <motion.div 
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mx-auto w-16 h-16 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6"
                                >
                                    <Activity className="w-8 h-8 text-white" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">AURA<span className="text-sky-400">ONE</span></h1>
                                <p className="text-slate-400 text-sm tracking-wide uppercase">Select your access portal</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roles.map((role) => (
                                    <Button
                                        key={role.id}
                                        variant="glass"
                                        className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-white/5 border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
                                        onClick={() => handleRoleSelect(role.id)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <role.icon className={`w-8 h-8 ${role.color} group-hover:scale-110 transition-transform duration-300`} />
                                        <div className="text-center relative z-10">
                                            <span className="text-slate-200 font-semibold text-lg block mb-1">{role.label}</span>
                                            <span className="text-slate-500 text-xs">{role.description}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </GlassPanel>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10 w-full max-w-md p-4"
                    >
                        <GlassPanel className="border-t border-white/10 shadow-2xl backdrop-blur-3xl px-8 py-10">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleBack} 
                                className="absolute top-4 left-4 text-slate-400 hover:text-white -ml-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>

                            <div className="text-center mb-8 mt-2">
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-4 ring-1 ring-white/10">
                                    {selectedRole && (() => {
                                        const r = roles.find(r => r.id === selectedRole);
                                        const Icon = r?.icon || Activity;
                                        return <Icon className={`w-6 h-6 ${r?.color}`} />;
                                    })()}
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {roles.find(r => r.id === selectedRole)?.label} Login
                                </h2>
                                <p className="text-slate-400 text-xs mt-1">Please authenticate your session</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <p>{error}</p>
                                    </motion.div>
                                )}

                                <div className="space-y-4">
                                    {/* Email Input */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input 
                                                type="email" 
                                                placeholder="name@aura.one" 
                                                className="!pl-10"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="!pl-10"
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Captcha */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-300 ml-1">Security Check</label>
                                        <div className="bg-slate-950/30 p-3 rounded-xl border border-white/5 space-y-3">
                                            <Captcha ref={captchaRef} />
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input 
                                                    placeholder="Enter captcha code" 
                                                    className="!pl-10 text-center uppercase tracking-widest font-mono"
                                                    value={captchaInput}
                                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                                    maxLength={6}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full h-11 text-base shadow-lg shadow-sky-500/25"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </form>
                        </GlassPanel>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
