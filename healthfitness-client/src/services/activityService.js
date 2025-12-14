import api from './api';

const activityService = {
    getAll: async () => {
        const response = await api.get('/activities');
        return response;
    },

    create: async (activityData) => {
        const response = await api.post('/activities', activityData);
        return response;
    },

    update: async (id, activityData) => {
        const response = await api.put(`/activities/${id}`, activityData);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`/activities/${id}`);
        return response;
    }
};

export default activityService;
