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
    login: (email: string, password: string) => void;
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

    const login = (email: string, password: string) => {
        setIsLoading(true);
        
        // Mock Login Logic
        setTimeout(() => {
            let role: Role = 'FAMILY';
            
            // Simple logic to derive role from email for demo purposes
            if (email.includes('doctor')) role = 'DOCTOR';
            else if (email.includes('nurse')) role = 'NURSE';
            else if (email.includes('admin')) role = 'ADMIN';
            
            // Validate domain
            if (!email.endsWith('@aura.one') && !email.endsWith('@innerve.com')) {
                setIsLoading(false);
                throw new Error("Invalid email domain. Please use your organization email.");
            }

            const mockUser: User = {
                id: crypto.randomUUID(),
                name: email.split('@')[0].toUpperCase(),
                email: email,
                role: role,
            };
            
            setUser(mockUser);
            localStorage.setItem('aura_user', JSON.stringify(mockUser));
            setIsLoading(false);
        }, 1500); // Simulate realistic network delay
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
