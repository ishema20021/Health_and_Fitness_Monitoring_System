import api from './api';

const notificationService = {
    getAll: async (count = 20) => {
        const response = await api.get(`/notification?count=${count}`);
        return response.data;
    },

    getUnread: async () => {
        const response = await api.get('/notification/unread');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/notification/unread/count');
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.put(`/notification/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.put('/notification/read-all');
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/notification/${id}`);
        return response.data;
    }
};

export default notificationService;
