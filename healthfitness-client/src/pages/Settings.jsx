import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Settings() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, changeLanguage, t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        goalReminders: true,
        achievementAlerts: true,
        profileVisibility: false,
        activitySharing: false,
        weeklyReports: true,
        monthlyReports: false,
        timezone: 'UTC',
        units: 'metric',
        autoSave: true,
        soundEffects: true,
        beginnerMode: localStorage.getItem('beginnerMode') === 'true',
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSettingToggle = (setting) => {
        const newValue = !settings[setting];
        setSettings({ ...settings, [setting]: newValue });

        if (setting === 'beginnerMode') {
            localStorage.setItem('beginnerMode', newValue);
            window.dispatchEvent(new Event('storage')); // Trigger update for other components
        }

        toast.success(t('settingUpdated'));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(t('passwordsDoNotMatch'));
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error(t('passwordTooShort'));
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/user/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response && response.success) {
                toast.success(t('passwordChanged'));
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error(error.message || t('passwordChangeFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await api.delete('/user/account');
                if (response && response.success) {
                    toast.success(t('accountDeleted'));
                    logout();
                }
            } catch (error) {
                toast.error(error.message || t('accountDeleteFailed'));
            }
        }
    };

    const handleExportData = () => {
        toast.success(t('dataExported'));
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>

            <div className="max-w-4xl space-y-6">
                {/* Account Information */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">👤</span>
                        {t('accountInformation')}
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{t('name')}</p>
                                <p className="text-gray-600">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{t('email')}</p>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">{t('accountCreated')}</p>
                                <p className="text-gray-600">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🎨</span>
                        {t('appearance')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{t('theme')}</p>
                                <p className="text-sm text-gray-600">{t('chooseTheme')}</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
                                <span className="font-semibold">{theme === 'light' ? t('darkMode') : t('lightMode')}</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <p className="font-semibold text-gray-900">{t('language')}</p>
                                <p className="text-sm text-gray-600">{t('selectLanguage')}</p>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="en">English</option>
                                <option value="rw">Kinyarwanda</option>
                                <option value="sw">Kiswahili</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔒</span>
                        {t('changePassword')}
                    </h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('currentPassword')}
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('newPassword')}
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {t('confirmNewPassword')}
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('saving') : t('changePassword')}
                        </button>
                    </form>
                </div>

                {/* Experience Level - Hidden for Admins */}
                {user?.role !== 'Admin' && (
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🌱</span>
                            Experience Level
                        </h2>
                        <div className="space-y-4">
                            <ToggleSetting
                                title="Beginner Mode"
                                description="Simplified interface, health-focused reminders, and reduced competition."
                                checked={settings.beginnerMode}
                                onChange={() => handleSettingToggle('beginnerMode')}
                            />
                        </div>
                    </div>
                )}


                {/* Notifications Settings */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔔</span>
                        {t('notifications')}
                    </h2>
                    <div className="space-y-4">
                        <ToggleSetting
                            title={t('emailNotifications')}
                            description={t('receiveEmailUpdates')}
                            checked={settings.emailNotifications}
                            onChange={() => handleSettingToggle('emailNotifications')}
                        />
                        <ToggleSetting
                            title={t('goalReminders')}
                            description={t('getRemindedGoals')}
                            checked={settings.goalReminders}
                            onChange={() => handleSettingToggle('goalReminders')}
                        />
                        <ToggleSetting
                            title={t('achievementAlerts')}
                            description={t('celebrateAchievements')}
                            checked={settings.achievementAlerts}
                            onChange={() => handleSettingToggle('achievementAlerts')}
                        />
                        <ToggleSetting
                            title={t('weeklyReports')}
                            description={t('receiveWeeklySummary')}
                            checked={settings.weeklyReports}
                            onChange={() => handleSettingToggle('weeklyReports')}
                        />
                        <ToggleSetting
                            title={t('monthlyReports')}
                            description={t('getMonthlyAnalytics')}
                            checked={settings.monthlyReports}
                            onChange={() => handleSettingToggle('monthlyReports')}
                        />
                        <ToggleSetting
                            title={t('soundEffects')}
                            description={t('playSounds')}
                            checked={settings.soundEffects}
                            onChange={() => handleSettingToggle('soundEffects')}
                        />
                    </div>
                </div>

                {/* Privacy & Data */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔐</span>
                        {t('privacyData')}
                    </h2>
                    <div className="space-y-4">
                        <ToggleSetting
                            title={t('profileVisibility')}
                            description={t('makeProfileVisible')}
                            checked={settings.profileVisibility}
                            onChange={() => handleSettingToggle('profileVisibility')}
                        />
                        <ToggleSetting
                            title={t('activitySharing')}
                            description={t('allowFriendsActivity')}
                            checked={settings.activitySharing}
                            onChange={() => handleSettingToggle('activitySharing')}
                        />
                        <ToggleSetting
                            title={t('autoSave')}
                            description={t('autoSaveProgress')}
                            checked={settings.autoSave}
                            onChange={() => handleSettingToggle('autoSave')}
                        />
                    </div>
                </div>

                {/* Units & Preferences */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📏</span>
                        {t('unitsPreferences')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{t('measurementUnits')}</p>
                                <p className="text-sm text-gray-600">{t('chooseUnits')}</p>
                            </div>
                            <select
                                value={settings.units}
                                onChange={(e) => setSettings({ ...settings, units: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="metric">Metric (kg, km)</option>
                                <option value="imperial">Imperial (lbs, miles)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <p className="font-semibold text-gray-900">{t('timezone')}</p>
                                <p className="text-sm text-gray-600">{t('setTimezone')}</p>
                            </div>
                            <select
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="UTC">UTC</option>
                                <option value="EST">Eastern Time</option>
                                <option value="PST">Pacific Time</option>
                                <option value="CET">Central European Time</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">💾</span>
                        {t('dataManagement')}
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-gray-900">{t('exportData')}</p>
                                <p className="text-sm text-gray-600">{t('downloadData')}</p>
                            </div>
                            <button
                                onClick={handleExportData}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                {t('exportData')}
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                                <p className="font-semibold text-gray-900">{t('clearCache')}</p>
                                <p className="text-sm text-gray-600">{t('clearLocalCache')}</p>
                            </div>
                            <button
                                onClick={() => toast.success(t('cacheCleared'))}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                {t('clearCache')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="card border-2 border-danger-200 bg-danger-50">
                    <h2 className="text-xl font-bold text-danger-900 mb-4 flex items-center">
                        <span className="mr-2">⚠️</span>
                        {t('dangerZone')}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-danger-800 mb-3">
                                {t('deleteAccountWarning')}
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-danger-600 hover:bg-danger-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
                            >
                                {t('deleteAccount')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleSetting({ title, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
            <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
        </div>
    );
}
