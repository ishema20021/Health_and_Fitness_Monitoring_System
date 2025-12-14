import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

export default function AdminSettings() {
    const { t, changeLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // System Settings State
    const [settings, setSettings] = useState({
        // General Settings
        siteName: 'HealthFitness',
        siteDescription: 'Track your health and fitness journey',
        maintenanceMode: false,

        // User Registration
        userRegistration: 'open', // open, closed, invite-only
        requireEmailVerification: true,
        allowSocialLogin: true,

        // Default User Settings
        defaultLanguage: 'en',
        defaultTheme: 'light',
        defaultBeginnerMode: false,

        // Notifications
        emailNotificationsEnabled: true,
        pushNotificationsEnabled: false,
        smsNotificationsEnabled: false,

        // Data & Privacy
        dataRetentionDays: 365,
        allowDataExport: true,
        gdprCompliance: true,

        // Security
        sessionTimeoutMinutes: 60,
        maxLoginAttempts: 5,
        requireStrongPassword: true,
        twoFactorAuthentication: false,

        // Features
        socialFeaturesEnabled: true,
        achievementsEnabled: true,
        leaderboardsEnabled: true,
        chatEnabled: false,

        // API
        apiRateLimit: 100, // requests per minute
        apiKeyRequired: false,
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);

            // Try to load from localStorage first
            const savedSettings = localStorage.getItem('adminSettings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings(prevSettings => ({ ...prevSettings, ...parsed }));

                // Apply site name if exists
                if (parsed.siteName) {
                    document.title = parsed.siteName;
                }
            }

            // Then try to load from backend (which may update localStorage)
            try {
                const response = await adminService.getSystemSettings();
                if (response?.data || response) {
                    const data = response.data || response;
                    setSettings(prevSettings => ({ ...prevSettings, ...data }));
                    localStorage.setItem('adminSettings', JSON.stringify({ ...settings, ...data }));
                }
            } catch (backendError) {
                // Backend not available, use localStorage or defaults
                console.log('Using local settings, backend not available');
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (setting) => {
        const newValue = !settings[setting];
        const newSettings = { ...settings, [setting]: newValue };
        setSettings(newSettings);

        // Apply setting immediately if relevant
        applySettingChange(setting, newValue);
    };

    const handleChange = (setting, value) => {
        const newSettings = { ...settings, [setting]: value };
        setSettings(newSettings);

        // Apply setting immediately if relevant
        applySettingChange(setting, value);
    };

    const applySettingChange = (setting, value) => {
        // Apply settings that have immediate effect
        switch (setting) {
            case 'defaultLanguage':
                changeLanguage(value);
                toast.success(`Language changed to ${value.toUpperCase()}`);
                break;
            case 'defaultTheme':
                if ((theme === 'light' && value === 'dark') || (theme === 'dark' && value === 'light')) {
                    toggleTheme();
                    toast.success(`Theme changed to ${value}`);
                }
                break;
            case 'siteName':
                // Update site name in document title
                document.title = value;
                // Dispatch custom event for navbar to update
                window.dispatchEvent(new CustomEvent('siteNameChange', { detail: value }));
                break;
            case 'maintenanceMode':
                if (value) {
                    toast.error('⚠️ Maintenance mode enabled', { duration: 3000 });
                } else {
                    toast.success('✅ Maintenance mode disabled', { duration: 3000 });
                }
                break;
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Save to localStorage immediately
            localStorage.setItem('adminSettings', JSON.stringify(settings));

            // Update document title with site name
            if (settings.siteName) {
                document.title = settings.siteName;
                window.dispatchEvent(new CustomEvent('siteNameChange', { detail: settings.siteName }));
            }

            // Try to save to backend
            try {
                const response = await adminService.updateSystemSettings(settings);
                if (response?.success || response) {
                    toast.success('✅ System settings saved successfully');
                    return;
                }
            } catch (backendError) {
                // Backend not available, but localStorage save succeeded
                console.log('Backend save failed, settings saved locally');
            }

            // If we reach here, settings were saved locally
            toast.success('✅ Settings saved locally');
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('❌ Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings 🔧</h1>
                    <p className="text-gray-600">Configure global system parameters</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary px-6 py-3 disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="max-w-4xl space-y-6">
                {/* General Settings */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⚙️</span>
                        General Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Site Description
                            </label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => handleChange('siteDescription', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                rows="2"
                            />
                        </div>
                        <ToggleSetting
                            title="Maintenance Mode"
                            description="Enable maintenance mode to prevent users from accessing the site"
                            checked={settings.maintenanceMode}
                            onChange={() => handleToggle('maintenanceMode')}
                        />
                    </div>
                </div>

                {/* User Registration */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">👤</span>
                        User Registration
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Registration Mode
                            </label>
                            <select
                                value={settings.userRegistration}
                                onChange={(e) => handleChange('userRegistration', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="open">Open - Anyone can register</option>
                                <option value="closed">Closed - Registration disabled</option>
                                <option value="invite-only">Invite Only - Requires invitation</option>
                            </select>
                        </div>
                        <ToggleSetting
                            title="Require Email Verification"
                            description="Users must verify their email before accessing the system"
                            checked={settings.requireEmailVerification}
                            onChange={() => handleToggle('requireEmailVerification')}
                        />
                        <ToggleSetting
                            title="Allow Social Login"
                            description="Enable login via Google, Facebook, etc."
                            checked={settings.allowSocialLogin}
                            onChange={() => handleToggle('allowSocialLogin')}
                        />
                    </div>
                </div>

                {/* Default User Settings */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🎯</span>
                        Default User Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Default Language
                            </label>
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="en">English</option>
                                <option value="rw">Kinyarwanda</option>
                                <option value="sw">Kiswahili</option>
                                <option value="fr">Français</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Default Theme
                            </label>
                            <select
                                value={settings.defaultTheme}
                                onChange={(e) => handleChange('defaultTheme', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <ToggleSetting
                            title="Default Beginner Mode"
                            description="Enable beginner mode for new users by default"
                            checked={settings.defaultBeginnerMode}
                            onChange={() => handleToggle('defaultBeginnerMode')}
                        />
                    </div>
                </div>

                {/* Notifications */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔔</span>
                        System Notifications
                    </h2>
                    <div className="space-y-4">
                        <ToggleSetting
                            title="Email Notifications"
                            description="Enable email notifications system-wide"
                            checked={settings.emailNotificationsEnabled}
                            onChange={() => handleToggle('emailNotificationsEnabled')}
                        />
                        <ToggleSetting
                            title="Push Notifications"
                            description="Enable push notifications for mobile apps"
                            checked={settings.pushNotificationsEnabled}
                            onChange={() => handleToggle('pushNotificationsEnabled')}
                        />
                        <ToggleSetting
                            title="SMS Notifications"
                            description="Enable SMS notifications (requires SMS gateway)"
                            checked={settings.smsNotificationsEnabled}
                            onChange={() => handleToggle('smsNotificationsEnabled')}
                        />
                    </div>
                </div>

                {/* Data & Privacy */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔐</span>
                        Data & Privacy
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Data Retention (Days)
                            </label>
                            <input
                                type="number"
                                value={settings.dataRetentionDays}
                                onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                min="30"
                                max="3650"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                How long to keep user data before automatic deletion
                            </p>
                        </div>
                        <ToggleSetting
                            title="Allow Data Export"
                            description="Users can export their data in JSON/CSV format"
                            checked={settings.allowDataExport}
                            onChange={() => handleToggle('allowDataExport')}
                        />
                        <ToggleSetting
                            title="GDPR Compliance Mode"
                            description="Enable strict GDPR compliance features"
                            checked={settings.gdprCompliance}
                            onChange={() => handleToggle('gdprCompliance')}
                        />
                    </div>
                </div>

                {/* Security */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🛡️</span>
                        Security Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Session Timeout (Minutes)
                            </label>
                            <input
                                type="number"
                                value={settings.sessionTimeoutMinutes}
                                onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                min="5"
                                max="1440"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Max Login Attempts
                            </label>
                            <input
                                type="number"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                min="3"
                                max="10"
                            />
                        </div>
                        <ToggleSetting
                            title="Require Strong Passwords"
                            description="Enforce strong password requirements (min 8 chars, uppercase, numbers)"
                            checked={settings.requireStrongPassword}
                            onChange={() => handleToggle('requireStrongPassword')}
                        />
                        <ToggleSetting
                            title="Two-Factor Authentication"
                            description="Enable 2FA for all users"
                            checked={settings.twoFactorAuthentication}
                            onChange={() => handleToggle('twoFactorAuthentication')}
                        />
                    </div>
                </div>

                {/* Features */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">✨</span>
                        Feature Toggles
                    </h2>
                    <div className="space-y-4">
                        <ToggleSetting
                            title="Social Features"
                            description="Enable social features like friends, posts, and comments"
                            checked={settings.socialFeaturesEnabled}
                            onChange={() => handleToggle('socialFeaturesEnabled')}
                        />
                        <ToggleSetting
                            title="Achievements System"
                            description="Enable achievements and badges"
                            checked={settings.achievementsEnabled}
                            onChange={() => handleToggle('achievementsEnabled')}
                        />
                        <ToggleSetting
                            title="Leaderboards"
                            description="Enable competitive leaderboards"
                            checked={settings.leaderboardsEnabled}
                            onChange={() => handleToggle('leaderboardsEnabled')}
                        />
                        <ToggleSetting
                            title="Chat System"
                            description="Enable real-time chat between users"
                            checked={settings.chatEnabled}
                            onChange={() => handleToggle('chatEnabled')}
                        />
                    </div>
                </div>

                {/* API Settings */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔌</span>
                        API Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                API Rate Limit (requests/minute)
                            </label>
                            <input
                                type="number"
                                value={settings.apiRateLimit}
                                onChange={(e) => handleChange('apiRateLimit', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                min="10"
                                max="1000"
                            />
                        </div>
                        <ToggleSetting
                            title="API Key Required"
                            description="Require API key for all API requests"
                            checked={settings.apiKeyRequired}
                            onChange={() => handleToggle('apiKeyRequired')}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="card bg-gradient-to-r from-primary-50 to-cyan-50 border-primary-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to save?</h3>
                            <p className="text-sm text-gray-600">
                                Make sure all settings are configured correctly before saving
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save All Settings'}
                        </button>
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
