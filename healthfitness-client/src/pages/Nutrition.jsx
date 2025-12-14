import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import nutritionService from '../services/nutritionService';

const Nutrition = () => {
    const [nutritionList, setNutritionList] = useState([]);
    const [dailyCalories, setDailyCalories] = useState(0);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        foodName: '',
        calories: '',
        mealType: 'Breakfast',
        protein: '',
        carbs: '',
        fat: '',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const listResponse = await nutritionService.getAll();
            const calorieResponse = await nutritionService.getDailyCalories();

            if (Array.isArray(listResponse)) {
                setNutritionList(listResponse);
            } else if (listResponse && listResponse.success) {
                setNutritionList(listResponse.data || []);
            }

            if (typeof calorieResponse === 'number') {
                setDailyCalories(calorieResponse);
            } else if (calorieResponse && calorieResponse.success) {
                setDailyCalories(calorieResponse.data);
            }
        } catch (error) {
            toast.error('Failed to load nutrition data');
            console.error(error);
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
                calories: Number(formData.calories),
                protein: formData.protein ? Number(formData.protein) : null,
                carbs: formData.carbs ? Number(formData.carbs) : null,
                fat: formData.fat ? Number(formData.fat) : null,
                fat: formData.fat ? Number(formData.fat) : null,
                time: formData.time.length === 5 ? formData.time + ":00" : formData.time, // Ensure HH:mm:ss format
                id: editingId ? editingId : 0
            };

            let response;
            if (editingId) {
                response = await nutritionService.update(editingId, dataToSubmit);
            } else {
                response = await nutritionService.create(dataToSubmit);
            }

            if (response && (response.id || response.success !== false)) {
                toast.success(editingId ? 'Meal updated successfully' : 'Meal added successfully');
                setFormData({
                    foodName: '',
                    calories: '',
                    mealType: 'Breakfast',
                    protein: '',
                    carbs: '',
                    fat: '',
                    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                });
                setEditingId(null);
                loadData();
            } else {
                toast.error(response?.message || (editingId ? 'Failed to update meal' : 'Failed to add meal'));
            }
        } catch (error) {
            console.error('Error saving meal:', error);
            toast.error(error?.response?.data?.message || (editingId ? 'Error updating meal' : 'Error adding meal'));
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({
            foodName: item.foodName,
            calories: item.calories,
            mealType: item.mealType,
            protein: item.protein || '',
            carbs: item.carbs || '',
            fat: item.fat || '',
            time: item.time ? item.time.substring(0, 5) : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        });
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            foodName: '',
            calories: '',
            mealType: 'Breakfast',
            protein: '',
            carbs: '',
            fat: '',
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                const response = await nutritionService.delete(id);
                if (response && (response.success !== false)) {
                    toast.success('Entry deleted');
                    loadData();
                } else {
                    toast.error('Failed to delete');
                }
            } catch (error) {
                toast.error('Error deleting entry');
            }
        }
    };

    // Group meals by type
    const groupedMeals = {
        Breakfast: nutritionList.filter(n => n.mealType === 'Breakfast'),
        Lunch: nutritionList.filter(n => n.mealType === 'Lunch'),
        Dinner: nutritionList.filter(n => n.mealType === 'Dinner'),
        Snack: nutritionList.filter(n => n.mealType === 'Snack'),
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Daily Calories</p>
                        <p className="text-3xl font-bold text-green-600">{Math.round(dailyCalories)} kcal</p>
                    </div>
                    {/* Placeholder for progress bar or goal comparison */}
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-2xl">🔥</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{editingId ? 'Edit Meal' : 'Add Food'}</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                                <input
                                    type="text"
                                    name="foodName"
                                    value={formData.foodName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                    <input
                                        type="number"
                                        name="calories"
                                        value={formData.calories}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
                                <select
                                    name="mealType"
                                    value={formData.mealType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Protein (g)</label>
                                    <input
                                        type="number"
                                        name="protein"
                                        value={formData.protein}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 rounded-lg border border-gray-300 text-sm"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Carbs (g)</label>
                                    <input
                                        type="number"
                                        name="carbs"
                                        value={formData.carbs}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 rounded-lg border border-gray-300 text-sm"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Fat (g)</label>
                                    <input
                                        type="number"
                                        name="fat"
                                        value={formData.fat}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-2 rounded-lg border border-gray-300 text-sm"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full text-white py-2 rounded-lg transition ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {editingId ? 'Update Meal' : 'Add Entry'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-6 max-h-[800px] overflow-y-auto">
                    {Object.entries(groupedMeals).map(([type, meals]) => (
                        <div key={type} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-gray-100 pb-2 flex justify-between">
                                {type}
                                <span className="text-sm font-normal text-gray-500">
                                    {Math.round(meals.reduce((sum, item) => sum + item.calories, 0))} kcal
                                </span>
                            </h3>

                            {meals.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No entries yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {meals.map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.foodName}</p>
                                                <div className="text-xs text-gray-500 flex gap-2">
                                                    <span>{Math.round(item.calories)} kcal</span>
                                                    {item.protein && <span>• P: {item.protein}g</span>}
                                                    {item.carbs && <span>• C: {item.carbs}g</span>}
                                                    {item.fat && <span>• F: {item.fat}g</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-400 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Nutrition;
