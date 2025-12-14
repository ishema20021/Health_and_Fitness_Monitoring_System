import api from './api';

const goalService = {
    getAll: async () => {
        const response = await api.get('/goals');
        return response;
    },

    getById: async (id) => {
        const response = await api.get(`/goals/${id}`);
        return response;
    },

    create: async (data) => {
        const { id, ...payload } = data;
        const response = await api.post('/goals', payload);
        return response;
    },

    update: async (id, data) => {
        const response = await api.put(`/goals/${id}`, data);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`/goals/${id}`);
        return response;
    },

    updateProgress: async (id, currentValue) => {
        const response = await api.patch(`/goals/${id}/progress`, currentValue, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response;
    },
};

export default goalService;

