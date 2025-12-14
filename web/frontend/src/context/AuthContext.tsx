import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'DOCTOR' | 'NURSE' | 'ADMIN' | 'FAMILY';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate session check
        const storedUser = localStorage.getItem('aura_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (role: Role) => {
        setIsLoading(true);
        // Mock Login Logic
        const mockUser: User = {
            id: '1',
            name: role === 'DOCTOR' ? 'Dr. Priyanshu' : role === 'NURSE' ? 'Nurse Sarah' : role === 'ADMIN' ? 'Admin User' : 'Family Member',
            email: `${role.toLowerCase()}@aura.one`,
            role: role,
        };
        
        setTimeout(() => {
            setUser(mockUser);
            localStorage.setItem('aura_user', JSON.stringify(mockUser));
            setIsLoading(false);
        }, 800); // Simulate network delay
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aura_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
