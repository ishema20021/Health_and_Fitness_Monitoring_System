import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import signalrService from '../services/signalrService';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
            // Start SignalR connection
            signalrService.start((notification) => {
                toast.success(`${notification.title}: ${notification.message}`, {
                    duration: 5000,
                    icon: notification.type === 'Achievement' ? '🏆' : '🔔',
                });
            });
        }

        return () => {
            signalrService.stop();
        };
    }, []);

    const login = async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);

        // Start SignalR after login
        signalrService.start((notification) => {
            toast.success(`${notification.title}: ${notification.message}`, {
                duration: 5000,
                icon: notification.type === 'Achievement' ? '🏆' : '🔔',
            });
        });

        return userData;
    };

    const register = async (userData) => {
        const user = await authService.register(userData);
        setUser(user);

        // Start SignalR after registration
        signalrService.start((notification) => {
            toast.success(`${notification.title}: ${notification.message}`, {
                duration: 5000,
                icon: notification.type === 'Achievement' ? '🏆' : '🔔',
            });
        });

        return user;
    };

    const logout = () => {
        authService.logout();
        signalrService.stop();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
