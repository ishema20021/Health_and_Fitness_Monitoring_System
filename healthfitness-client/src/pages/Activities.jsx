import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import activityService from '../services/activityService';
import adminService from '../services/adminService';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

const Activities = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('Admin') || user?.role === 'Admin';

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        activityType: 'Running',
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        caloriesBurned: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get('type');
        const durationParam = params.get('duration');
        if (typeParam || durationParam) {
            setFormData(prev => ({
                ...prev,
                activityType: typeParam || 'Running',
                duration: durationParam || '',
            }));
        }
    }, []);

    const activityTypes = [
        'Running', 'Cycling', 'Swimming', 'Walking',
        'Yoga', 'Strength Training', 'HIIT', 'Other'
    ];

    useEffect(() => {
        loadData();
    }, [isAdmin]);

    const loadData = async () => {
        try {
            setLoading(true);
            let response;

            if (isAdmin) {
                response = await adminService.getAllActivities();
            } else {
                response = await activityService.getAll();
            }

            // Handle both array and wrapped responses
            if (Array.isArray(response)) {
                setActivities(response.slice().sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else if (response && response.success) {
                setActivities(response.data.slice().sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else if (response && !response.success) {
                console.error('API returned success=false:', response);
                toast.error(response.message || 'Failed to load activities');
            } else {
                console.warn('Empty or unknown response, setting empty activities');
                setActivities([]);
            }
        } catch (error) {
            console.error('Activities load error:', error);
            if (error.response && error.response.status !== 404) {
                toast.error(`Failed to load activities`);
            }
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                duration: Number(formData.duration),
                caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : 0,
                caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : 0,
                date: new Date(formData.date).toISOString(),
                id: editingId ? editingId : 0
            };

            let response;
            if (editingId) {
                response = await activityService.update(editingId, dataToSubmit);
            } else {
                response = await activityService.create(dataToSubmit);
            }

            if (response && (response.id || response.success !== false)) {
                toast.success(editingId ? t('activityUpdated') : t('activityLogged'));
                setFormData(prev => ({
                    ...prev,
                    duration: '',
                    notes: '',
                    caloriesBurned: ''
                }));
                setEditingId(null);
                loadData();
            } else {
                toast.error(response?.message || (editingId ? t('activityUpdateFailed') : t('activityLogFailed')));
            }
        } catch (error) {
            toast.error(editingId ? t('activityUpdateFailed') : t('activityLogFailed'));
            console.error(error);
        }
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        setFormData({
            activityType: activity.activityType,
            duration: activity.duration,
            date: activity.date ? activity.date.split('T')[0] : new Date().toISOString().split('T')[0],
            notes: activity.notes || '',
            caloriesBurned: activity.caloriesBurned || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(prev => ({
            ...prev,
            duration: '',
            notes: '',
            caloriesBurned: ''
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('confirmDeleteActivity'))) {
            try {
                if (isAdmin) {
                    toast.error("Admins cannot delete user activities here.");
                    return;
                }

                const response = await activityService.delete(id);
                if (response && (response.success !== false)) {
                    toast.success(t('activityDeleted'));
                    loadData();
                } else {
                    toast.error(t('activityDeleteFailed'));
                }
            } catch (error) {
                toast.error(t('activityDeleteFailed'));
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {isAdmin ? 'System Activity Log 📋' : t('activityLog')}
            </h1>

            <div className={`grid grid-cols-1 ${isAdmin ? '' : 'lg:grid-cols-3'} gap-8`}>

                {/* Form Section - HIDDEN FOR ADMIN */}
                {!isAdmin && (
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">{editingId ? t('editActivity') : t('addActivity')}</h2>
                                {editingId && (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">{t('activityType')}</label>
                                    <select
                                        name="activityType"
                                        value={formData.activityType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {activityTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">{t('duration')} ({t('durationPlaceholder')})</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">{t('date')}</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">{t('notes')}</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder={t('notesPlaceholder')}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full text-white py-2 px-4 rounded-lg transition duration-200 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {editingId ? t('updateActivity') : t('saveActivity')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* List Section */}
                <div className={isAdmin ? 'col-span-1' : 'lg:col-span-2'}>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {isAdmin ? 'All User Activities' : t('recentActivities')}
                        </h2>
                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : activities.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {t('noRecentActivities')}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="border-b last:border-0 pb-4 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-lg text-blue-600">{activity.activityType}</h3>
                                                    {isAdmin && activity.userName && (
                                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600 border border-gray-200">
                                                            👤 {activity.userName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(activity.date).toLocaleDateString()} • {activity.duration} {t('durationPlaceholder')}
                                                </p>
                                                {activity.caloriesBurned > 0 && (
                                                    <p className="text-gray-500 text-sm">
                                                        🔥 {activity.caloriesBurned} {t('caloriesPlaceholder')}
                                                    </p>
                                                )}
                                                {activity.notes && (
                                                    <p className="text-gray-500 text-sm mt-1 italic">"{activity.notes}"</p>
                                                )}
                                            </div>
                                            {!isAdmin && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(activity)}
                                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(activity.id)}
                                                        className="text-red-500 hover:text-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Activities;
