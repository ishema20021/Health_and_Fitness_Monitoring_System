import api from './api';

const sleepService = {
    getAll: async () => {
        const response = await api.get('/sleep');
        return response; // Api interceptor returns data
    },

    log: async (data) => {
        const { id, ...payload } = data;
        const response = await api.post('/sleep', payload);
        return response;
    },

    getAverageDuration: async () => {
        const response = await api.get('/sleep/average-duration');
        return response;
    },

    update: async (id, data) => {
        const response = await api.put(`/sleep/${id}`, data);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`/sleep/${id}`);
        return response;
    },
};

export default sleepService;
