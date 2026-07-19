import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // Token configuration mappings (Decode layer mock)
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                
                // Expiry handling validation check
                if (payload.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: payload.sub, email: payload.email });
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (jwtToken, supervisorData) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser({ id: supervisorData.supervisor_id, name: supervisorData.name });
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);