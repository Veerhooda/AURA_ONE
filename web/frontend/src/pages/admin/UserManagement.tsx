import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Mail, Shield, Building2 } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'DOCTOR' | 'NURSE' | 'ADMIN' | 'Staff' | 'FAMILY';
    department?: string;
    status: 'ACTIVE' | 'INACTIVE';
    lastActive: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Dr. Sarah Wilson', email: 'sarah.wilson@aura.one', role: 'DOCTOR', department: 'Cardiology', status: 'ACTIVE', lastActive: '2 mins ago' },
        { id: '2', name: 'Nurse John Doe', email: 'john.doe@aura.one', role: 'NURSE', department: 'Emergency', status: 'ACTIVE', lastActive: '1 hr ago' },
        { id: '3', name: 'Admin User', email: 'admin@aura.one', role: 'ADMIN', status: 'ACTIVE', lastActive: 'Just now' },
        { id: '4', name: 'Dr. Emily Chen', email: 'emily.chen@aura.one', role: 'DOCTOR', department: 'Neurology', status: 'INACTIVE', lastActive: '2 days ago' },
        { id: '5', name: 'James Smith', email: 'james.smith@gmail.com', role: 'FAMILY', status: 'ACTIVE', lastActive: '5 hrs ago' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (user?: User) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser({ status: 'ACTIVE', role: 'DOCTOR' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentUser({});
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser.id) {
            // Edit existing
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...currentUser } as User : u));
        } else {
            // Add new
            const newUser = {
                ...currentUser,
                id: Math.random().toString(36).substr(2, 9),
                lastActive: 'Never'
            } as User;
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'DOCTOR': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
            case 'NURSE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'FAMILY': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400 mt-1">Manage system access, roles, and permissions.</p>
                </div>
                
                <Button onClick={() => handleOpenModal()} className="gap-2 shadow-neon-blue">
                    <Plus className="w-4 h-4" /> Add User
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-950 border-slate-800" 
                    />
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <Button variant="ghost" className="text-slate-400 hover:text-white gap-2">
                    <Filter className="w-4 h-4" /> Filter Role
                </Button>
            </div>

            {/* Users Table */}
            <GlassPanel className="overflow-hidden p-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-xs text-slate-500 uppercase tracking-wider bg-white/5">
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Department</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/10">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-primary transition-colors">{user.name}</div>
                                            <div className="text-sm text-slate-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge className={getRoleColor(user.role)}>
                                        <Shield className="w-3 h-3 mr-1" /> {user.role}
                                    </Badge>
                                </td>
                                <td className="p-4 text-slate-400">
                                    {user.department ? (
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                            {user.department}
                                        </div>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border ${
                                        user.status === 'ACTIVE' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            size="sm" variant="ghost" 
                                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                            onClick={() => handleOpenModal(user)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            size="sm" variant="ghost" 
                                            className="h-8 w-8 p-0 text-slate-400 hover:text-alert"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassPanel>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentUser.id ? 'Edit User' : 'Add New User'}
            >
                <form onSubmit={handleSaveUser} className="space-y-4 p-1">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                        <Input 
                            value={currentUser.name || ''} 
                            onChange={e => setCurrentUser({...currentUser, name: e.target.value})}
                            required
                            placeholder="e.g. Dr. John Doe"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <Input 
                                type="email"
                                value={currentUser.email || ''} 
                                onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                                required
                                placeholder="name@aura.one"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Role</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                value={currentUser.role}
                                onChange={e => setCurrentUser({...currentUser, role: e.target.value as any})}
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                                <option value="ADMIN">Admin</option>
                                <option value="Staff">Staff</option>
                                <option value="FAMILY">Family</option>
                            </select>
                        </div>
                    </div>

                    {(currentUser.role === 'DOCTOR' || currentUser.role === 'NURSE') && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Department</label>
                             <select 
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                value={currentUser.department || ''}
                                onChange={e => setCurrentUser({...currentUser, department: e.target.value})}
                            >
                                <option value="">Select Department...</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Orthopedics">Orthopedics</option>
                            </select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Status</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={currentUser.status === 'ACTIVE'}
                                    onChange={() => setCurrentUser({...currentUser, status: 'ACTIVE'})}
                                    className="accent-emerald-500"
                                /> 
                                Active
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={currentUser.status === 'INACTIVE'}
                                    onChange={() => setCurrentUser({...currentUser, status: 'INACTIVE'})}
                                    className="accent-slate-500"
                                /> 
                                Inactive
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" className="shadow-neon-blue">
                            {currentUser.id ? 'Save Changes' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserManagement;
