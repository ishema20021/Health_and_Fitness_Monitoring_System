import api from './api';

const adminService = {
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response;
    },

    toggleUserStatus: async (userId) => {
        const response = await api.post(`/admin/users/${userId}/toggle-status`);
        return response;
    },

    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response;
    },

    getAllActivities: async () => {
        const response = await api.get('/admin/activities');
        return response;
    },

    getSystemSettings: async () => {
        const response = await api.get('/admin/settings');
        return response;
    },

    updateSystemSettings: async (settings) => {
        const response = await api.put('/admin/settings', settings);
        return response;
    }
};

export default adminService;
