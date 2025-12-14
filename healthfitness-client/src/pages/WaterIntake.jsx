import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import waterService from '../services/waterService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../hooks/useLanguage';

const WaterIntake = () => {
    const { t } = useLanguage();
    const [todayIntake, setTodayIntake] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const todayResponse = await waterService.getTodayIntake();
            const historyResponse = await waterService.getHistory(7);

            // Access response.success directly (unwrapped in service correction)
            if (todayResponse?.success) {
                setTodayIntake(todayResponse.data);
            }
            if (historyResponse?.success) {
                // Reverse history to show oldest to newest
                setHistory(historyResponse.data.slice().reverse().map(item => ({
                    ...item,
                    displayDate: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })
                })));
            }
        } catch (error) {
            console.error('Failed to load water data', error);
        } finally {
            setLoading(false);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');

    const handleAddWater = async (amount) => {
        try {
            setAdding(true);
            const response = await waterService.logIntake(amount);
            if (response?.success) {
                toast.success(`+${amount}ml`);
                setTodayIntake(response.data);
                loadData(); // Reload history too
            } else {
                toast.error('Failed to log water intake');
            }
        } catch (error) {
            toast.error('Error logging intake');
        } finally {
            setAdding(false);
        }
    };

    const handleUpdateWater = async (amount) => {
        try {
            const response = await waterService.updateIntake(amount);
            if (response?.success) {
                toast.success('Water intake updated');
                setTodayIntake(response.data);
                setIsEditing(false);
                loadData();
            } else {
                toast.error('Failed to update water intake');
            }
        } catch (error) {
            toast.error('Error updating intake');
            console.error(error);
        }
    };

    if (loading && !todayIntake) {
        return <div className="p-8 text-center text-gray-500">Loading hydration data...</div>;
    }

    const currentAmount = todayIntake?.amountInMl || 0;
    const goal = todayIntake?.dailyGoalInMl || 2000;
    const percentage = Math.min(100, Math.round((currentAmount / goal) * 100));

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">{t('water')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Main Control Panel */}
                <div className="card flex flex-col items-center justify-center space-y-6 relative">
                    {/* Reset/Delete Button */}
                    <button
                        onClick={() => {
                            if (window.confirm('Reset today\'s water intake to 0?')) {
                                handleUpdateWater(0);
                            }
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                        title="Reset Day"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="relative h-64 w-64">
                        {/* Circular Progress (Simple CSS implementation) */}
                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background Circle */}
                            <circle
                                className="text-gray-100 dark:text-slate-700"
                                strokeWidth="8"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                            {/* Progress Circle */}
                            <circle
                                className="text-blue-500 transition-all duration-500 ease-out"
                                strokeWidth="8"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                            />
                        </svg>

                        {/* Center Text or Edit Form */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-900 dark:text-blue-300">
                            {isEditing ? (
                                <div className="flex flex-col items-center animate-fade-in bg-white/90 p-2 rounded-lg">
                                    <input
                                        type="number"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        className="w-24 text-center border-b-2 border-blue-500 focus:outline-none text-2xl font-bold bg-transparent"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleUpdateWater(Number(editValue))}
                                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span
                                        className="text-5xl font-bold cursor-pointer hover:scale-105 transition"
                                        onClick={() => {
                                            setEditValue(currentAmount);
                                            setIsEditing(true);
                                        }}
                                        title="Click to edit total"
                                    >
                                        {currentAmount}
                                    </span>
                                    <span className="text-sm font-medium text-blue-400">/ {goal} ml</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full">
                        <button
                            onClick={() => handleAddWater(250)}
                            disabled={adding}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-slate-700 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-600 transition text-blue-700 dark:text-blue-200"
                        >
                            <span className="text-xl mb-1">🥛</span>
                            <span className="text-sm font-semibold">+250ml</span>
                        </button>
                        <button
                            onClick={() => handleAddWater(500)}
                            disabled={adding}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-slate-700 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-600 transition text-blue-700 dark:text-blue-200"
                        >
                            <span className="text-xl mb-1">🥤</span>
                            <span className="text-sm font-semibold">+500ml</span>
                        </button>
                        <button
                            onClick={() => handleAddWater(750)}
                            disabled={adding}
                            className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-slate-700 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-600 transition text-blue-700 dark:text-blue-200"
                        >
                            <span className="text-xl mb-1">🧴</span>
                            <span className="text-sm font-semibold">+750ml</span>
                        </button>
                    </div>
                </div>

                {/* History Chart */}
                <div className="card">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Last 7 Days</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amountInMl"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWater)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Advice Section */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-200">
                            Drinking water before meals can help you feel fuller and aid in weight management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaterIntake;
