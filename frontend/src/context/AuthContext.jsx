import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const authData = response.data; // AuthResponse Dto
            
            // Set user including token
            setUser(authData);
            localStorage.setItem('currentUser', JSON.stringify(authData));
            
            return { success: true, role: authData.role };
        } catch (error) {
            console.error("Login failed", error);
            // Check if backend sent an error message
            const message = error.response?.data?.message || 'Invalid credentials';
            return { success: false, message: message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const register = async (newUser) => {
        try {
            // newUser is expected to have { name, email, password, role }
            await api.post('/auth/register', newUser);
            return { success: true };
        } catch (error) {
            console.error("Registration failed", error);
            const message = error.response?.data?.message || 'Registration failed. Email might already exist.';
            return { success: false, message: message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
