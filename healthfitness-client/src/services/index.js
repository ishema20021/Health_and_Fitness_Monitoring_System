import api from './api';

export const activityService = {
    getAll: () => api.get('/activities'),
    getById: (id) => api.get(`/activities/${id}`),
    create: (data) => api.post('/activities', data),
    update: (id, data) => api.put(`/activities/${id}`, data),
    delete: (id) => api.delete(`/activities/${id}`),
};

export const nutritionService = {
    getAll: () => api.get('/nutrition'),
    getById: (id) => api.get(`/nutrition/${id}`),
    create: (data) => api.post('/nutrition', data),
    update: (id, data) => api.put(`/nutrition/${id}`, data),
    delete: (id) => api.delete(`/nutrition/${id}`),
    getDailyCalories: () => api.get('/nutrition/daily-calories'),
};

export const goalService = {
    getAll: () => api.get('/goals'),
    getById: (id) => api.get(`/goals/${id}`),
    create: (data) => api.post('/goals', data),
    update: (id, data) => api.put(`/goals/${id}`, data),
    delete: (id) => api.delete(`/goals/${id}`),
    updateProgress: (id, currentValue) => api.patch(`/goals/${id}/progress`, currentValue),
};

export const sleepService = {
    getAll: () => api.get('/sleep'),
    create: (data) => api.post('/sleep', data),
    getAverageDuration: () => api.get('/sleep/average-duration'),
};

export const waterService = {
    getToday: () => api.get('/waterintake/today'),
    log: (amount) => api.post('/waterintake/log', amount),
    getHistory: (days = 7) => api.get(`/waterintake/history?days=${days}`),
};

export const achievementService = {
    getAll: () => api.get('/achievements'),
    getUserAchievements: () => api.get('/achievements/user'),
    check: () => api.post('/achievements/check'),
};

export const dashboardService = {
    getDashboard: () => api.get('/dashboard'),
};
