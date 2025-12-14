import api from './api';

const waterService = {
    getTodayIntake: async () => {
        const response = await api.get('/waterintake/today');
        return response;
    },

    logIntake: async (amount) => {
        const response = await api.post('/waterintake/log', amount, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    updateIntake: async (amount) => {
        const response = await api.put('/waterintake/update', amount, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    getHistory: async (days = 7) => {
        const response = await api.get(`/waterintake/history?days=${days}`);
        return response;
    }
};

export default waterService;
