import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(
        import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'
            ? { id: 'dev-user', name: 'Dev User', email: 'dev@example.com', role: import.meta.env.VITE_DEV_ROLE || 'ADMIN' }
            : null
    );
    const [loading, setLoading] = useState(import.meta.env.VITE_DEV_BYPASS_AUTH !== 'true');

    useEffect(() => {
        if (import.meta.env.VITE_DEV_BYPASS_AUTH !== 'true') {
            checkAuth();
        }
    }, []);

    const checkAuth = async () => {
        try {
            const data = await apiClient.get('/api/auth/check-auth');
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await apiClient.post('/api/auth/login', { email, password });
        setUser(data.user); // token is set in httpOnly cookie
        return data.user;
    };

    const register = async (name, email, password) => {
        const data = await apiClient.post('/api/auth/register', { name, email, password, role: 'USER' });
        // After successful registration, login is called which sets the user
        return await login(email, password);
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
