import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../hooks/useLanguage';

import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth();

    // Check if user has Admin role (backend returns 'Admin' in roles array)
    const isAdmin = user?.roles?.includes('Admin') ||
        user?.role?.toLowerCase() === 'admin' ||
        user?.userRole?.toLowerCase() === 'admin';

    // Check for Beginner Mode
    const [beginnerMode, setBeginnerMode] = useState(localStorage.getItem('beginnerMode') === 'true');

    // Listen for storage changes to update mode instantly
    useEffect(() => {
        const handleStorageChange = () => {
            setBeginnerMode(localStorage.getItem('beginnerMode') === 'true');
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('itemInserted', handleStorageChange); // Custom event if needed
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (isAdmin) {
        return <AdminDashboard />;
    }

    if (beginnerMode) {
        return <BeginnerDashboard />;
    }

    return <UserDashboard />;
}

function BeginnerDashboard() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Healthy Start! 🌱</h1>
                <p className="text-gray-600 text-lg">Focus on consistency and feeling good.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Daily Commitment */}
                <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <h2 className="text-xl font-bold text-green-900 mb-4">Daily Wellness Goal</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
                            💧
                        </div>
                        <div>
                            <p className="font-semibold text-green-800">Drink 8 glasses of water</p>
                            <p className="text-sm text-green-600">Hydration is key to energy!</p>
                        </div>
                    </div>
                    <div className="mt-4 bg-white rounded-full h-4 w-full overflow-hidden border border-green-100">
                        <div className="h-full bg-green-500 w-3/4"></div>
                    </div>
                </div>

                {/* 2. Movement Reminder */}
                <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <h2 className="text-xl font-bold text-blue-900 mb-4">Movement Reminder</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">
                            🚶
                        </div>
                        <div>
                            <p className="font-semibold text-blue-800">Take a 15 min walk</p>
                            <p className="text-sm text-blue-600">Clear your mind and body.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/activities?type=Walking&duration=15'}
                        className="mt-4 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-sm border border-blue-100 w-full hover:bg-blue-50"
                    >
                        Log Walk
                    </button>
                </div>
            </div>

            {/* 3. Daily Tip */}
            <div className="card border-l-4 border-yellow-400 bg-yellow-50">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">💡 Daily Tip</h3>
                <p className="text-yellow-900">
                    "Don't worry about speed or intensity today. Just showing up is the victory."
                </p>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    // Placeholder for Admin Stats - in a real app, you'd fetch /admin/stats
    // For now, we'll show a system overview interpretation
    return (
        <div className="animate-fade-in space-y-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard 🛡️</h1>
                <p className="text-gray-600 text-lg">System Overview & Management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-slate-800 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-4xl font-bold">250+</p>
                    <p className="text-sm text-slate-400 mt-2">Active in last 30 days</p>
                </div>
                <div className="card bg-blue-600 text-white">
                    <h3 className="text-lg font-semibold mb-2">System Activities</h3>
                    <p className="text-4xl font-bold">1.2k</p>
                    <p className="text-sm text-blue-200 mt-2">Logged this week</p>
                </div>
                <div className="card bg-emerald-600 text-white">
                    <h3 className="text-lg font-semibold mb-2">Server Status</h3>
                    <p className="text-4xl font-bold">99.9%</p>
                    <p className="text-sm text-emerald-200 mt-2">Uptime</p>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Administration Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/users')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left transition hover:shadow-md hover:border-primary-500"
                    >
                        <span className="text-2xl mr-2">👥</span>
                        <span className="font-semibold">Manage Users</span>
                        <p className="text-sm text-gray-500 mt-1">View, edit, or ban users</p>
                    </button>
                    <button
                        onClick={() => navigate('/admin/settings')}
                        className="p-4 border rounded-lg hover:bg-gray-50 text-left transition hover:shadow-md hover:border-primary-500"
                    >
                        <span className="text-2xl mr-2">🔧</span>
                        <span className="font-semibold">System Settings</span>
                        <p className="text-sm text-gray-500 mt-1">Configure global parameters</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserDashboard() {
    const { t } = useLanguage();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const response = await dashboardService.getDashboard();
            setDashboard(response?.data || response || {});
        } catch (error) {
            console.error('Dashboard load error:', error);
            // toast.error('Failed to load dashboard');
            setDashboard({}); // Set empty object to prevent errors
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    // ... Rest of the User Dashboard logic (Charts, Stats, etc.) ...
    // Since I'm replacing the whole component logic, I need to copy the internal logic of the original component here.
    // I will duplicate the original render logic here.

    const activityData = [
        { name: 'Mon', calories: 420 },
        { name: 'Tue', calories: 380 },
        { name: 'Wed', calories: 520 },
        { name: 'Thu', calories: 450 },
        { name: 'Fri', calories: 600 },
        { name: 'Sat', calories: 550 },
        { name: 'Sun', calories: 480 },
    ];

    const nutritionData = [
        { name: 'Protein', value: 30, color: '#ef4444' },
        { name: 'Carbs', value: 45, color: '#f59e0b' },
        { name: 'Fats', value: 25, color: '#22c55e' },
    ];

    // Safely get values with defaults
    const activityCount = dashboard?.activityCount || 0;
    const totalCaloriesBurned = dashboard?.totalCaloriesBurned || 0;
    const goalsCount = dashboard?.goals?.length || 0;
    const achievementsCount = dashboard?.totalAchievements || 0;
    const recentActivities = dashboard?.recentActivities || [];
    const goals = dashboard?.goals || [];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('welcomeBack')} 👋</h1>
                <p className="text-gray-600 text-lg">{t('fitnessOverview')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={t('totalActivities')}
                    value={activityCount}
                    icon="🏃"
                    gradient="from-blue-500 to-cyan-500"
                    change="+12%"
                />
                <StatCard
                    title={t('caloriesBurned')}
                    value={`${totalCaloriesBurned}`}
                    unit="kcal"
                    icon="🔥"
                    gradient="from-red-500 to-orange-500"
                    change="+8%"
                />
                <StatCard
                    title={t('activeGoals')}
                    value={goalsCount}
                    icon="🎯"
                    gradient="from-purple-500 to-pink-500"
                    change="+3"
                />
                <StatCard
                    title={t('achievements')}
                    value={achievementsCount}
                    icon="🏆"
                    gradient="from-yellow-500 to-orange-500"
                    change="+2"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Weekly Activity Chart */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📈</span>
                        {t('weeklyCalorieBurn')}
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            />
                            <Bar dataKey="calories" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" />
                                    <stop offset="100%" stopColor="#0284c7" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Nutrition Distribution */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🥗</span>
                        {t('nutritionDistribution')}
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={nutritionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {nutritionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activities & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">⚡</span>
                            {t('recentActivities')}
                        </h2>
                        <button
                            onClick={() => navigate('/activities')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            {t('viewAll')} →
                        </button>
                    </div>
                    {recentActivities.length > 0 ? (
                        <div className="space-y-3">
                            {recentActivities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {activity.activityType?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{activity.activityType}</p>
                                            <p className="text-sm text-gray-600">{activity.duration} {t('durationPlaceholder')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-primary-600">{activity.caloriesBurned || 0}</p>
                                        <p className="text-xs text-gray-500">{t('calories')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-6xl mb-4">🏃</p>
                            <p className="text-gray-500 mb-2">{t('noRecentActivities')}</p>
                            <p className="text-sm text-gray-400 mb-4">{t('startTracking')}</p>
                            <button
                                onClick={() => navigate('/activities')}
                                className="btn-primary text-sm"
                            >
                                {t('logActivity')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Goal Progress */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">🎯</span>
                            {t('goalProgress')}
                        </h2>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                            {t('manageGoals')} →
                        </button>
                    </div>
                    {goals.length > 0 ? (
                        <div className="space-y-4">
                            {goals.map((goal, index) => (
                                <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-gray-900">{goal.goalType}</span>
                                        <span className="text-sm font-bold text-primary-600">
                                            {goal.currentValue}/{goal.targetValue}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500 transition-all duration-500"
                                            style={{
                                                width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">
                                        {Math.round((goal.currentValue / goal.targetValue) * 100)}% Complete
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-6xl mb-4">🎯</p>
                            <p className="text-gray-500 mb-2">{t('noActiveGoals')}</p>
                            <p className="text-sm text-gray-400 mb-4">{t('setFirstGoal')}</p>
                            <button className="btn-primary text-sm">
                                {t('createGoal')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Motivational Quote */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl shadow-lg text-white">
                <p className="text-2xl font-bold mb-2">💪 {t('dailyMotivation')}</p>
                <p className="text-lg italic">{t('motivationQuote')}</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, unit, icon, gradient, change }) {
    return (
        <div className="card hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {value}
                        {unit && <span className="text-lg text-gray-600 ml-1">{unit}</span>}
                    </p>
                    {change && (
                        <p className="text-sm text-success-600 font-semibold mt-1">
                            {change} from last week
                        </p>
                    )}
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
