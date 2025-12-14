import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import sleepService from '../services/sleepService';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

const Sleep = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('Admin') || user?.role === 'Admin';

    const [sleepLogs, setSleepLogs] = useState([]);
    const [avgDuration, setAvgDuration] = useState(0);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        qualityRating: 3,
        notes: ''
    });

    useEffect(() => {
        // Admins might not have access to get sleep logs if permissions are strictly revoked.
        // If we want Admins to see *Users'* sleep logs, we'd need an endpoint in AdminController.
        // For now, avoiding the 403 by skipping load if Admin, OR handling the error gracefully.
        if (!isAdmin) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

    const loadData = async () => {
        try {
            setLoading(true);
            const logsResponse = await sleepService.getAll();
            const avgResponse = await sleepService.getAverageDuration();

            if (Array.isArray(logsResponse)) {
                setSleepLogs(logsResponse.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
            } else if (logsResponse && logsResponse.success) {
                setSleepLogs(logsResponse.data.slice().sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
            }

            if (typeof avgResponse === 'number') {
                setAvgDuration(avgResponse);
            } else if (avgResponse && (avgResponse.success || typeof avgResponse.data === 'number')) {
                setAvgDuration(avgResponse.data);
            }
        } catch (error) {
            // If 403, it's expected for some roles
            if (error?.response?.status !== 403) {
                console.error('Sleep load error:', error);
            }
            // Don't show toast on load
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
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);

            if (end <= start) {
                toast.error('Wake up time must be after bed time');
                return;
            }

            const dataToSubmit = {
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                qualityRating: Number(formData.qualityRating),
                notes: formData.notes,
                id: editingId ? editingId : 0
            };

            let response;
            if (editingId) {
                response = await sleepService.update(editingId, dataToSubmit);
            } else {
                response = await sleepService.log(dataToSubmit);
            }

            if (response && (response.id || response.success !== false)) {
                toast.success(editingId ? 'Sleep log updated' : 'Sleep logged successfully');
                setFormData({
                    startTime: '',
                    endTime: '',
                    qualityRating: 3,
                    notes: ''
                });
                setEditingId(null);
                loadData();
            } else {
                toast.error(response?.message || (editingId ? 'Failed to update sleep log' : 'Failed to log sleep'));
            }
        } catch (error) {
            toast.error(editingId ? 'Error updating sleep log' : 'Error logging sleep');
            console.error(error);
        }
    };

    const handleEdit = (log) => {
        setEditingId(log.id);
        // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
        const formatDateTime = (dateStr) => {
            const date = new Date(dateStr);
            const pad = (num) => String(num).padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        setFormData({
            startTime: formatDateTime(log.startTime),
            endTime: formatDateTime(log.endTime),
            qualityRating: log.qualityRating,
            notes: log.notes || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            startTime: '',
            endTime: '',
            qualityRating: 3,
            notes: ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sleep log?')) {
            try {
                const response = await sleepService.delete(id);
                if (response && (response.success !== false)) {
                    toast.success('Sleep log deleted');
                    loadData();
                } else {
                    toast.error('Failed to delete sleep log');
                }
            } catch (error) {
                toast.error('Error deleting sleep log');
            }
        }
    };

    const calculateDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const getQualityLabel = (rating) => {
        switch (rating) {
            case 1: return '😫 Very Poor';
            case 2: return '😕 Poor';
            case 3: return '😐 Fair';
            case 4: return '🙂 Good';
            case 5: return '🥳 Excellent';
            default: return 'Unknown';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">{t('sleep')} 😴</h1>
                {!isAdmin && (
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 rounded-2xl border border-gray-700 shadow-lg flex items-center gap-3">
                        <div className="text-white">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Average Sleep</p>
                            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                {Math.floor(avgDuration)}h {Math.round((avgDuration % 1) * 60)}m
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Educational Info Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-3">Why Track Sleep?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="mb-4 text-indigo-100 leading-relaxed">
                                Quality sleep is the foundation of good health. Tracking helps you understand your patterns and improve your rest.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    Aim for 7-9 hours per night
                                </li>
                                <li className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    Consistent bedtimes improve quality
                                </li>
                                <li className="flex items-center gap-2 text-sm text-indigo-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                    Monitor how you feel (Quality Rating)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {isAdmin ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Administrator Mode</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Personal sleep tracking is a user-only feature. As an Administrator, you do not have a personal health record to log data into.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Log Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">Now</span>
                                    {editingId ? 'Edit Sleep Log' : 'Log Sleep'}
                                </h2>
                                {editingId && (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">When did you go to bed?</label>
                                    <input
                                        type="datetime-local"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">When did you wake up?</label>
                                    <input
                                        type="datetime-local"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Sleep Quality</label>
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                        <div className="flex justify-between mb-4">
                                            {['😫', '😕', '😐', '🙂', '🥳'].map((emoji, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, qualityRating: idx + 1 }))}
                                                    className={`text-2xl p-2 rounded-lg transition-all ${Number(formData.qualityRating) === idx + 1 ? 'bg-white shadow-md scale-110' : 'opacity-50 hover:opacity-100 hover:bg-gray-200'}`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="range"
                                            name="qualityRating"
                                            min="1"
                                            max="5"
                                            value={formData.qualityRating}
                                            onChange={handleInputChange}
                                            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <div className="text-center mt-3 font-bold text-indigo-600">
                                            {getQualityLabel(Number(formData.qualityRating))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('notes')}</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                                        rows="3"
                                        placeholder="Did you dream? Wake up often?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full text-white py-4 rounded-xl transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${editingId ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}
                                >
                                    {editingId ? 'Update Sleep Log' : 'Save Sleep Log'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">History</h2>
                            {sleepLogs.length > 0 && (
                                <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">Last 30 Days</span>
                            )}
                        </div>

                        {loading && (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        )}

                        {!loading && sleepLogs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">💤</div>
                                <h3 className="text-lg font-bold text-gray-900">No logs yet</h3>
                                <p className="text-gray-500 mt-2">Start tracking your sleep to see trends here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sleepLogs.map(log => (
                                    <div key={log.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="font-bold text-gray-900 text-xl">
                                                        {new Date(log.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
                                                        {calculateDuration(log.startTime, log.endTime)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                        <span className="text-lg">🛏️</span>
                                                        <span className="font-medium">{new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center text-gray-300">➜</div>
                                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                        <span className="text-lg">☀️</span>
                                                        <span className="font-medium">{new Date(log.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                {log.notes && (
                                                    <div className="mt-4 flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                        <span className="mt-0.5">📝</span>
                                                        <span className="leading-relaxed">{log.notes}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-6 border-l pl-6 border-gray-100">
                                                <div className="flex flex-col items-center min-w-[80px]">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner mb-2">
                                                        {['😫', '😕', '😐', '🙂', '🥳'][log.qualityRating - 1]}
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${log.qualityRating >= 4 ? 'bg-green-500' :
                                                                    log.qualityRating === 3 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${(log.qualityRating / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleEdit(log)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(log.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};



export default Sleep;
