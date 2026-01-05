import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Building2, Bell, Plug, AlertTriangle, RefreshCw, UploadCloud, CheckCircle, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SystemSettings = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'integrations' | 'maintenance'>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Mock Form State
    const [generalSettings, setGeneralSettings] = useState({
        hospitalName: 'AURA ONE Hospital',
        contactEmail: 'admin@aura.one',
        supportPhone: '+1 (555) 123-4567',
        timezone: 'UTC-5 (Eastern Time)',
        currency: 'USD ($)',
    });

    const [apiKeys, setApiKeys] = useState({
        ambulance: 'ak_live_7823...8d92',
        insurance: 'ins_test_9921...kd21',
        pharmacy: 'ph_v2_1100...mm23'
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1500);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: Building2 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'Integrations', icon: Plug },
        { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
                    <p className="text-slate-400 mt-1">Configure global parameters and integrations.</p>
                </div>
                <div className="flex items-center gap-4">
                    {showSuccess && (
                        <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-emerald-400 text-sm font-medium flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Settings Saved
                        </motion.span>
                    )}
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className={cn("gap-2 shadow-neon-blue w-32", isSaving && "opacity-80 cursor-wait")}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save All
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex gap-6">
                {/* Check: Tabs Sidebar for Settings */}
                <div className="w-64 flex-shrink-0 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                                activeTab === tab.id 
                                    ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <GlassPanel className="min-h-[500px]">
                        
                        {/* GENERAL SETTINGS */}
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-sky-400" /> General Configuration
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Hospital Name</label>
                                        <Input 
                                            value={generalSettings.hospitalName}
                                            onChange={(e) => setGeneralSettings({...generalSettings, hospitalName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Default Currency</label>
                                        <select className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary/50 transition-colors">
                                            <option>USD ($)</option>
                                            <option>INR (₹)</option>
                                            <option>EUR (€)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Contact Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input 
                                                className="pl-10"
                                                value={generalSettings.contactEmail}
                                                onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Support Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input 
                                                className="pl-10"
                                                value={generalSettings.supportPhone}
                                                onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 my-6" />

                                <div className="space-y-4">
                                     <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Localization</h4>
                                     <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Timezone</label>
                                            <select className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary/50 transition-colors">
                                                <option>UTC-5 (Eastern Time)</option>
                                                <option>UTC+0 (GMT)</option>
                                                <option>UTC+5:30 (IST)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Date Format</label>
                                            <select className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-primary/50 transition-colors">
                                                <option>MM/DD/YYYY</option>
                                                <option>DD/MM/YYYY</option>
                                                <option>YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-yellow-400" /> Notification Preferences
                                </h3>

                                <div className="space-y-4">
                                    {['Critical System Alerts', 'New User Registrations', 'Security Warnings', 'Weekly Reports'].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                                            <span className="text-slate-200 font-medium">{item}</span>
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-offset-slate-900" />
                                                    Email
                                                </label>
                                                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                                    <input type="checkbox" defaultChecked={i === 0} className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-offset-slate-900" />
                                                    SMS
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* INTEGRATIONS */}
                        {activeTab === 'integrations' && (
                             <div className="space-y-6 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Plug className="w-5 h-5 text-emerald-400" /> External API Integrations
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-emerald-400">Ambulance Dispatch System</h4>
                                                <p className="text-xs text-emerald-500/70 mt-1">Status: Connected • Latency: 45ms</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-slate-400 uppercase">API Key</label>
                                            <Input 
                                                value={apiKeys.ambulance}
                                                onChange={(e) => setApiKeys({...apiKeys, ambulance: e.target.value})}
                                                className="font-mono text-xs bg-slate-950 border-slate-800"
                                                type="password"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-blue-400">Insurance Gateway (MediClaim)</h4>
                                                <p className="text-xs text-blue-500/70 mt-1">Status: Connected • Latency: 120ms</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-mono text-slate-400 uppercase">Client Secret</label>
                                            <Input 
                                                value={apiKeys.insurance}
                                                onChange={(e) => setApiKeys({...apiKeys, insurance: e.target.value})}
                                                className="font-mono text-xs bg-slate-950 border-slate-800"
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                </div>
                             </div>
                        )}

                        {/* MAINTENANCE */}
                        {activeTab === 'maintenance' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-alert" /> System Maintenance
                                </h3>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Data Backup</h4>
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700">
                                        <div>
                                            <div className="text-white font-medium">Create Manual Backup</div>
                                            <div className="text-xs text-slate-500 mt-1">Last backup: Today, 04:00 AM (Automated)</div>
                                        </div>
                                        <Button variant="outline" className="gap-2">
                                            <UploadCloud className="w-4 h-4" /> Backup Now
                                        </Button>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5" />

                                <div className="space-y-4">
                                    <h4 className="text-sm font-medium text-alert uppercase tracking-wider">Danger Zone</h4>
                                    <div className="p-4 rounded-lg border border-alert/30 bg-alert/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-white font-medium">Reset Test Data</div>
                                                <div className="text-xs text-slate-400 mt-1">Permanently delete all mock patients and records. This cannot be undone.</div>
                                            </div>
                                            <Button className="bg-alert hover:bg-red-600 text-white border-none">
                                                Reset System
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
