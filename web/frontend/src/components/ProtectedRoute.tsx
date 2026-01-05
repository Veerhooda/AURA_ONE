import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, Role } from '../context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // You might want a better loading spinner here
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if they try to access an unauthorized route
        switch (user.role) {
            case 'DOCTOR': return <Navigate to="/doctor" replace />;
            case 'NURSE': return <Navigate to="/nurse" replace />;
            case 'ADMIN': return <Navigate to="/admin" replace />;
            case 'FAMILY': return <Navigate to="/family" replace />;
            default: return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
