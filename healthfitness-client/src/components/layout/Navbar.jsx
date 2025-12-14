import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import notificationService from '../../services/notificationService';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [siteName, setSiteName] = useState('HealthFitness');

    useEffect(() => {
        const handleSiteNameChange = (e) => setSiteName(e.detail);
        window.addEventListener('siteNameChange', handleSiteNameChange);
        return () => window.removeEventListener('siteNameChange', handleSiteNameChange);
    }, []);

    useEffect(() => {
        // Load initial unread count
        loadUnreadCount();

        // Check for notifications periodically (every minute)
        const interval = setInterval(loadUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const loadUnreadCount = async () => {
        if (!user) return;
        try {
            const response = await notificationService.getUnreadCount();
            if (response.success) {
                setUnreadCount(response.data);
            }
        } catch (error) {
            console.error('Failed to load notification count', error);
        }
    };

    const loadNotifications = async () => {
        if (!user) return;
        try {
            const response = await notificationService.getAll(10);
            if (response.success) {
                setNotifications(response.data || []);
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

    const handleToggleNotifications = () => {
        if (!showNotifications) {
            loadNotifications();
        }
        setShowNotifications(!showNotifications);
        setShowDropdown(false);
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            // Update UI locally
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNotificationDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'Goal': return '🎯';
            case 'Social': return '👥';
            case 'Achievement': return '🏆';
            case 'System': return '⚙️';
            default: return '🔔';
        }
    };

    return (
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-full mx-auto px-6">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img src="/logo.png" alt={siteName} className="w-10 h-10 object-contain" />
                        <Link to="/dashboard" className="text-2xl font-bold text-gradient">
                            {siteName}
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6 relative">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={handleToggleNotifications}
                                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                <span className="text-2xl">🔔</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-up">
                                    <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-900">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllRead}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500">
                                                <p className="text-4xl mb-2">🔕</p>
                                                <p>No notifications yet</p>
                                            </div>
                                        ) : (
                                            <div>
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition flex gap-3 ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                                                    >
                                                        <div className="flex-shrink-0 text-xl mt-1">
                                                            {getNotificationIcon(notification.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                                                                    {notification.title}
                                                                </p>
                                                                {!notification.isRead && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleMarkAsRead(notification.id);
                                                                        }}
                                                                        className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"
                                                                        title="Mark as read"
                                                                    ></button>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {getNotificationDate(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShowDropdown(!showDropdown);
                                    setShowNotifications(false);
                                }}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{t('viewProfile')}</p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-xl">👤</span>
                                        <span className="text-sm font-medium text-gray-700">{t('myProfile')}</span>
                                    </Link>

                                    <Link
                                        to="/settings"
                                        onClick={() => setShowDropdown(false)}
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-xl">⚙️</span>
                                        <span className="text-sm font-medium text-gray-700">{t('settings')}</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-danger-50 transition-colors border-t border-gray-200 mt-2"
                                    >
                                        <span className="text-xl">🚪</span>
                                        <span className="text-sm font-medium text-danger-600">{t('logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
