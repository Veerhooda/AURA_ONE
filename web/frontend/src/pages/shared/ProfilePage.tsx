import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Key, Camera, Award, Clock, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const ProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock specific data based on role
    const getRoleSpecificData = () => {
        switch (user?.role) {
            case 'DOCTOR':
                return {
                    sections: [
                        { label: 'License Number', value: 'MD-NY-88321', icon: Award },
                        { label: 'Specialization', value: 'Cardiology', icon: Briefcase },
                        { label: 'Experience', value: '12 Years', icon: Clock },
                    ]
                };
            case 'NURSE':
                return {
                    sections: [
                        { label: 'Employee ID', value: 'NS-8821', icon: Award },
                        { label: 'Ward Assignment', value: 'ICU - West Wing', icon: MapPin },
                        { label: 'Shift', value: 'Day (08:00 - 16:00)', icon: Clock },
                    ]
                };
            case 'ADMIN':
                return {
                     sections: [
                        { label: 'Admin Level', value: 'Super Admin', icon: Shield },
                        { label: 'Access Group', value: 'Level 5 (Full Access)', icon: Key },
                     ]
                };
            case 'FAMILY':
                return {
                     sections: [
                        { label: 'Relation to Patient', value: 'Spouse', icon: User },
                        { label: 'Emergency Access', value: 'Granted', icon: Shield },
                     ]
                };
            default:
                return { sections: [] };
        }
    };

    const roleData = getRoleSpecificData();

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
                <Button 
                    variant={isEditing ? 'default' : 'outline'} 
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="space-y-6">
                    <GlassPanel className="text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700/50 flex items-center justify-center relative overflow-hidden group">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-slate-500" />
                                )}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900" />
                        </div>
                        
                        <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                        <Badge variant="neon" className="mt-2">{user?.role}</Badge>
                    </GlassPanel>

                    <GlassPanel>
                         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
                         <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs text-slate-500">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <div className="text-slate-200 text-sm">{user?.email}</div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs text-slate-500">
                                    <Phone className="w-3 h-3" /> Phone
                                </label>
                                <div className="text-slate-200 text-sm flex justify-between items-center">
                                    {isEditing ? (
                                        <Input className="h-8 text-xs bg-slate-900 border-slate-700" defaultValue="+1 (555) 123-4567" />
                                    ) : (
                                        <span>+1 (555) 123-4567</span>
                                    )}
                                </div>
                            </div>
                         </div>
                    </GlassPanel>
                </div>

                {/* Right Column: Roles & Security */}
                <div className="md:col-span-2 space-y-6">
                    <GlassPanel>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                             <Briefcase className="w-5 h-5 text-primary" /> Professional Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {roleData.sections.map((item, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-slate-800 text-primary">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">{item.label}</div>
                                            <div className="text-lg font-medium text-white mt-1">{item.value}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassPanel>

                    <GlassPanel>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                             <Shield className="w-5 h-5 text-emerald-400" /> Security & Login
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/50">
                                <div>
                                    <div className="font-medium text-white">Two-Factor Authentication</div>
                                    <div className="text-xs text-slate-400 mt-1">Add an extra layer of security to your account</div>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-500">
                                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                                </div>
                            </div>

                             <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-slate-900/50">
                                <div>
                                    <div className="font-medium text-white">Password</div>
                                    <div className="text-xs text-slate-400 mt-1">Last changed 3 months ago</div>
                                </div>
                                <Button variant="outline" size="sm">Update</Button>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
