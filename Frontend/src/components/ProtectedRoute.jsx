import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // Redirect unauthenticated profiles to central login gate
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;