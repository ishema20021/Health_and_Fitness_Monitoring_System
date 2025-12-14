import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Profile() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: user?.age || '',
        gender: user?.gender || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.put('/user/profile', {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null,
            });

            if (response && response.success) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success(t('profileUpdated'));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error(error.message || t('profileUpdateFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('myProfile')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="card text-center">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg mb-4">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                        <p className="text-gray-600 mb-4">{user?.email}</p>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-3 bg-primary-50 rounded-lg">
                                <p className="text-sm text-gray-600">{t('age')}</p>
                                <p className="text-xl font-bold text-primary-700">{user?.age || 'N/A'}</p>
                            </div>
                            <div className="p-3 bg-cyan-50 rounded-lg">
                                <p className="text-sm text-gray-600">{t('gender')}</p>
                                <p className="text-xl font-bold text-cyan-700">{user?.gender || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-cyan-50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-1">{t('memberSince')}</p>
                            <p className="text-sm text-gray-600">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Edit Profile Form */}
                <div className="lg:col-span-2">
                    <div className="card">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">{t('editProfile')}</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('fullName')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {t('email')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">{t('emailCannotChange')}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('age')}
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        min="13"
                                        max="120"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {t('gender')}
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    >
                                        <option value="">{t('selectLanguage')}</option>
                                        <option value="Male">{t('male')}</option>
                                        <option value="Female">{t('female')}</option>
                                        <option value="Other">{t('other')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('saving') : t('saveChanges')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        name: user?.name || '',
                                        email: user?.email || '',
                                        age: user?.age || '',
                                        gender: user?.gender || '',
                                    })}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    {t('cancel')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Stats Section */}
                    <div className="card mt-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{t('activitySummary')}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                                <p className="text-3xl font-bold text-blue-600 mb-1">0</p>
                                <p className="text-sm text-gray-600">{t('totalActivities')}</p>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                <p className="text-3xl font-bold text-green-600 mb-1">0</p>
                                <p className="text-sm text-gray-600">{t('activeGoals')}</p>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                                <p className="text-3xl font-bold text-orange-600 mb-1">0</p>
                                <p className="text-sm text-gray-600">{t('achievements')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
