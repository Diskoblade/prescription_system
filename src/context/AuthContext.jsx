import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Use lazy initializer to read from localStorage immediately
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [loading] = useState(false);

    const login = (email, password) => {
        // Mock login - accept any valid email
        if (email && password) {
            const mockUser = {
                id: 'dr_rahul',
                name: 'Dr. Rahul TP',
                email,
                role: 'doctor'
            };
            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
