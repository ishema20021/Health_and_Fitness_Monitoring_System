import api from './api';

const nutritionService = {
    getAll: async () => {
        const response = await api.get('/nutrition');
        return response;
    },

    getById: async (id) => {
        const response = await api.get(`/nutrition/${id}`);
        return response;
    },

    create: async (data) => {
        const { id, ...payload } = data;
        const response = await api.post('/nutrition', payload);
        return response;
    },

    update: async (id, data) => {
        const response = await api.put(`/nutrition/${id}`, data);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`/nutrition/${id}`);
        return response;
    },

    getDailyCalories: async () => {
        const response = await api.get('/nutrition/daily-calories');
        return response;
    },
};

export default nutritionService;

