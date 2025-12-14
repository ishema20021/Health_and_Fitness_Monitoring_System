import api from './api';

const achievementService = {
    getAll: async () => {
        const response = await api.get('/achievements');
        return response;
    },

    getUserAchievements: async () => {
        const response = await api.get('/achievements/user');
        return response;
    },

    checkAchievements: async () => {
        const response = await api.post('/achievements/check', {});
        return response;
    }
};

export default achievementService;
