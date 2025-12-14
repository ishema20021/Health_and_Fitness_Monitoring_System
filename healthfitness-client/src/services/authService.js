import api from './api';

export const authService = {
    async login(email, password) {
        try {
            console.log('Attempting login for:', email);
            const response = await api.post('/auth/login', { email, password });
            console.log('Login API response:', response);

            // The API interceptor returns response.data, so response IS the data object
            // Check if it has the expected structure
            if (response && response.token) {
                // Direct response with token
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response));
                return response;
            } else if (response && response.success && response.data) {
                // Wrapped response
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                return response.data;
            }

            // If we get here, login failed
            const errorMessage = response?.message || 'Invalid email or password';
            throw new Error(errorMessage);
        } catch (error) {
            console.error('Login error:', error);
            // If it's already an Error object, throw it
            if (error instanceof Error) {
                throw error;
            }
            // Otherwise, create a new error with the message
            const errorMessage = error?.message || error || 'Login failed. Please try again.';
            throw new Error(errorMessage);
        }
    },

    async register(userData) {
        try {
            console.log('Attempting registration for:', userData.email);
            const response = await api.post('/auth/register', userData);
            console.log('Register API response:', response);

            // The API interceptor returns response.data, so response IS the data object
            if (response && response.token) {
                // Direct response with token
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response));
                return response;
            } else if (response && response.success && response.data) {
                // Wrapped response
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                return response.data;
            }

            // If we get here, registration failed
            const errorMessage = response?.message || 'Registration failed. Please try again.';
            throw new Error(errorMessage);
        } catch (error) {
            console.error('Registration error:', error);
            // If it's already an Error object, throw it
            if (error instanceof Error) {
                throw error;
            }
            // Otherwise, create a new error with the message
            const errorMessage = error?.message || error || 'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};
