import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import goalService from '../services/goalService';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        goalType: '',
        targetValue: '',
        currentValue: '0',
        deadline: '',
        status: 'In Progress'
    });

    const goalTypes = [
        'Weight Loss', 'Weight Gain', 'Muscle Gain',
        'Running Distance', 'Daily Steps', 'Water Intake',
        'Sleep Duration', 'Calorie Burn', 'Other'
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await goalService.getAll();

            if (Array.isArray(response)) {
                setGoals(response);
            } else if (response && response.success) {
                setGoals(response.data || []);
            } else if (response && !response.success) {
                toast.error(response.message || 'Failed to load goals');
            }
        } catch (error) {
            toast.error('Failed to load goals');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                targetValue: Number(formData.targetValue),
                currentValue: Number(formData.currentValue),
                deadline: new Date(formData.deadline).toISOString(),
                initialValue: Number(formData.currentValue) // Assuming starting from current
            };

            const response = await goalService.create(dataToSubmit);

            // The response is already the data object from the API
            // Check if it has an id or success property, or if it's the created goal itself
            if (response && (response.id || response.success !== false)) {
                toast.success('Goal created successfully');
                setShowModal(false);
                setFormData({
                    goalType: '',
                    targetValue: '',
                    currentValue: '0',
                    deadline: '',
                    status: 'In Progress'
                });
                loadData();
            } else {
                toast.error(response?.message || 'Failed to create goal');
            }
        } catch (error) {
            console.error('Error creating goal:', error);
            toast.error(error?.response?.data?.message || 'Error creating goal');
        }
    };

    const handleUpdateProgress = async (id, newValue) => {
        try {
            const response = await goalService.updateProgress(id, Number(newValue));
            if (response.success) {
                toast.success('Progress updated');
                loadData();
            }
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                const response = await goalService.delete(id);
                if (response && (response.success !== false)) {
                    toast.success('Goal deleted');
                    loadData();
                } else {
                    toast.error('Failed to delete goal');
                }
            } catch (error) {
                toast.error('Error deleting goal');
            }
        }
    };

    const calculateProgress = (current, target, type) => {
        // Simple percentage calculation
        // For weight loss, logic might be inverted in a real app, but simplified here
        if (target === 0) return 0;
        return Math.min(100, Math.round((current / target) * 100));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative group">
                        <button
                            onClick={() => handleDelete(goal.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Goal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div>
                            <div className="flex justify-between items-start mb-4 pr-8">
                                <div className="flex flex-col gap-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${goal.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {goal.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Due {new Date(goal.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.goalType}</h3>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-bold text-gray-900">{calculateProgress(goal.currentValue, goal.targetValue)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${calculateProgress(goal.currentValue, goal.targetValue)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>{goal.currentValue}</span>
                                    <span>Target: {goal.targetValue}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Update Progress</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    defaultValue={goal.currentValue}
                                    onBlur={(e) => {
                                        if (Number(e.target.value) !== goal.currentValue) {
                                            handleUpdateProgress(goal.id, e.target.value);
                                        }
                                    }}
                                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                                />
                                <button className="text-gray-400 hover:text-purple-600">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Goal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Create New Goal</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
                                <select
                                    name="goalType"
                                    value={formData.goalType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Select a goal type...</option>
                                    {goalTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                                    <input
                                        type="number"
                                        name="targetValue"
                                        value={formData.targetValue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                                    <input
                                        type="number"
                                        name="currentValue"
                                        value={formData.currentValue}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition mt-4"
                            >
                                Create Goal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
