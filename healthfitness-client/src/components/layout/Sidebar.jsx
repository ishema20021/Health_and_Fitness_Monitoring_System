import { useState, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export default function Sidebar() {
    const { user } = useAuth();
    const { t } = useLanguage();

    // Check if user has Admin role (backend returns 'Admin' in roles array)
    const isAdmin = user?.roles?.includes('Admin') ||
        user?.role?.toLowerCase() === 'admin' ||
        user?.userRole?.toLowerCase() === 'admin';

    // Check if user has Moderator role
    const isModerator = user?.roles?.includes('ContentModerator') ||
        user?.email?.includes('mod') ||
        user?.email === 'moderator@healthfitness.com';

    // Check for Beginner Mode
    const [beginnerMode, setBeginnerMode] = useState(localStorage.getItem('beginnerMode') === 'true');

    useLayoutEffect(() => {
        const handleStorageChange = () => {
            setBeginnerMode(localStorage.getItem('beginnerMode') === 'true');
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('itemInserted', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    let navItems;
    if (isAdmin) {
        navItems = [
            { to: '/dashboard', label: t('adminDashboard'), icon: '📊', gradient: 'from-blue-600 to-indigo-600' },
            { to: '/users', label: t('userManagement'), icon: '👥', gradient: 'from-slate-600 to-slate-500' },
            { to: '/reports', label: t('reports'), icon: '📈', gradient: 'from-emerald-600 to-teal-600' },
            { to: '/settings', label: t('settings'), icon: '⚙️', gradient: 'from-gray-600 to-gray-500' },
        ];
    } else if (isModerator) {
        navItems = [
            { to: '/dashboard', label: 'Moderator Dashboard', icon: '🛡️', gradient: 'from-purple-600 to-indigo-600' },
            { to: '/moderation', label: 'Moderation Queue', icon: '⚖️', gradient: 'from-amber-600 to-orange-600' },
            { to: '/social', label: t('social'), icon: '👥', gradient: 'from-pink-500 to-rose-500' },
            { to: '/settings', label: t('settings'), icon: '⚙️', gradient: 'from-gray-600 to-gray-500' },
        ];
    } else {
        // Regular User
        navItems = [
            { to: '/dashboard', label: t('dashboard'), icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
            { to: '/activities', label: t('activities'), icon: '🏃', gradient: 'from-green-500 to-emerald-500' },
            { to: '/nutrition', label: t('nutrition'), icon: '🍎', gradient: 'from-red-500 to-orange-500' },
            { to: '/goals', label: t('goals'), icon: '🎯', gradient: 'from-purple-500 to-pink-500' },
            { to: '/sleep', label: t('sleep'), icon: '😴', gradient: 'from-indigo-500 to-blue-500' },
            { to: '/water', label: t('water'), icon: '💧', gradient: 'from-cyan-500 to-blue-500' },
            { to: '/achievements', label: t('achievements'), icon: '🏆', gradient: 'from-yellow-500 to-orange-500' },
            { to: '/social', label: t('social'), icon: '👥', gradient: 'from-pink-500 to-rose-500' },
            { to: '/settings', label: t('settings'), icon: '⚙️', gradient: 'from-gray-500 to-gray-400' },
        ];

        // Apply Beginner Mode Filters
        if (beginnerMode) {
            navItems = navItems.filter(item =>
                item.to !== '/achievements' &&
                item.to !== '/social' &&
                item.to !== '/goals' // Simplifying goals too? Keeping goals for now as they are personal.
            );
        }
    }

    return (
        <aside className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen flex flex-col">

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white shadow-lg transform scale-105'
                                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`text-2xl transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <div className="p-3 bg-gradient-to-br from-primary-50 to-cyan-50 rounded-lg">
                    <p className="text-xs font-semibold text-primary-900 mb-1">💪 {t('dailyMotivation')}</p>
                    <p className="text-xs text-gray-700">{t('motivationQuote')}</p>
                </div>
            </div>
        </aside>
    );
}
