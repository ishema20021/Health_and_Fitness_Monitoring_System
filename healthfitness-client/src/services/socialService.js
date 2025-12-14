import api from './api';

// Enhanced mock users database with Instagram-like profiles
const MOCK_USERS = [
    {
        id: 'user1',
        userName: 'Sarah Johnson',
        email: 'sarah.j@healthfit.com',
        bio: '🏃‍♀️ Marathon runner | Yoga enthusiast | Plant-based athlete | Running towards my goals one mile at a time',
        profilePic: 'SJ',
        stats: { followers: 234, following: 189, posts: 47 },
        recentActivities: [
            { type: 'Running', duration: 45, calories: 520, date: '2025-12-13' },
            { type: 'Yoga', duration: 30, calories: 120, date: '2025-12-12' }
        ]
    },
    {
        id: 'user2',
        userName: 'Mike Chen',
        email: 'mike.chen@healthfit.com',
        bio: '💪 Fitness coach | CrossFit Level 2 | Helping people transform their lives through fitness',
        profilePic: 'MC',
        stats: { followers: 1.2, following: 145, posts: 128 },
        recentActivities: [
            { type: 'Strength', duration: 60, calories: 450, date: '2025-12-13' },
            { type: 'Cycling', duration: 40, calories: 380, date: '2025-12-12' }
        ]
    },
    {
        id: 'user3',
        userName: 'Emma Williams',
        email: 'emma.w@healthfit.com',
        bio: '🧘‍♀️ Mindfulness & movement | Certified yoga instructor | Finding balance in every pose',
        profilePic: 'EW',
        stats: { followers: 567, following: 234, posts: 89 },
        recentActivities: [
            { type: 'Yoga', duration: 60, calories: 180, date: '2025-12-13' },
            { type: 'Swimming', duration: 35, calories: 320, date: '2025-12-11' }
        ]
    },
    {
        id: 'user4',
        userName: 'David Martinez',
        email: 'david.m@healthfit.com',
        bio: '🚴 Cycling enthusiast | Mountain biker | Exploring trails and pushing limits',
        profilePic: 'DM',
        stats: { followers: 423, following: 312, posts: 76 },
        recentActivities: [
            { type: 'Cycling', duration: 90, calories: 780, date: '2025-12-13' },
            { type: 'Running', duration: 25, calories: 250, date: '2025-12-12' }
        ]
    },
    {
        id: 'user5',
        userName: 'Lisa Anderson',
        email: 'lisa.a@healthfit.com',
        bio: '🏊‍♀️ Triathlete in training | Swim • Bike • Run | Chasing personal records',
        profilePic: 'LA',
        stats: { followers: 892, following: 456, posts: 134 },
        recentActivities: [
            { type: 'Swimming', duration: 50, calories: 420, date: '2025-12-13' },
            { type: 'Running', duration: 40, calories: 380, date: '2025-12-12' }
        ]
    },
    {
        id: 'user6',
        userName: 'James Taylor',
        email: 'james.t@healthfit.com',
        bio: '🏋️ Powerlifter | Nutrition geek | Building strength one rep at a time',
        profilePic: 'JT',
        stats: { followers: 678, following: 289, posts: 103 },
        recentActivities: [
            { type: 'Strength', duration: 75, calories: 520, date: '2025-12-13' },
            { type: 'Strength', duration: 70, calories: 490, date: '2025-12-11' }
        ]
    },
    {
        id: 'user7',
        userName: 'Sophia Brown',
        email: 'sophia.b@healthfit.com',
        bio: '🌟 Wellness advocate | Daily runner | Spreading positivity through fitness',
        profilePic: 'SB',
        stats: { followers: 1.5, following: 567, posts: 156 },
        recentActivities: [
            { type: 'Running', duration: 35, calories: 340, date: '2025-12-13' },
            { type: 'Yoga', duration: 45, calories: 150, date: '2025-12-12' }
        ]
    },
    {
        id: 'user8',
        userName: 'Ryan Davis',
        email: 'ryan.d@healthfit.com',
        bio: '⚡ HIIT trainer | Functional fitness | Making workouts fun and effective',
        profilePic: 'RD',
        stats: { followers: 934, following: 412, posts: 98 },
        recentActivities: [
            { type: 'Strength', duration: 50, calories: 420, date: '2025-12-13' },
            { type: 'Running', duration: 30, calories: 290, date: '2025-12-12' }
        ]
    },
    {
        id: 'user9',
        userName: 'Olivia Wilson',
        email: 'olivia.w@healthfit.com',
        bio: '🎯 Goal crusher | Marathon finisher | Inspiring others to start their journey',
        profilePic: 'OW',
        stats: { followers: 756, following: 334, posts: 112 },
        recentActivities: [
            { type: 'Running', duration: 60, calories: 580, date: '2025-12-13' },
            { type: 'Cycling', duration: 45, calories: 420, date: '2025-12-11' }
        ]
    },
    {
        id: 'user10',
        userName: 'Alex Thompson',
        email: 'alex.t@healthfit.com',
        bio: '🏃 Ultra runner | Trail explorer | Running is my meditation',
        profilePic: 'AT',
        stats: { followers: 612, following: 278, posts: 87 },
        recentActivities: [
            { type: 'Running', duration: 120, calories: 1100, date: '2025-12-13' },
            { type: 'Strength', duration: 40, calories: 310, date: '2025-12-12' }
        ]
    }
];

// Get friends from localStorage
const getLocalFriends = () => {
    try {
        const friends = localStorage.getItem('healthfit_friends');
        return friends ? JSON.parse(friends) : [];
    } catch {
        return [];
    }
};

// Save friends to localStorage
const saveLocalFriends = (friends) => {
    try {
        localStorage.setItem('healthfit_friends', JSON.stringify(friends));
    } catch (error) {
        console.error('Failed to save friends to localStorage', error);
    }
};

const socialService = {
    getFeed: async () => {
        try {
            const response = await api.get('/social/feed');
            return response;
        } catch (error) {
            // Return empty feed if backend fails
            return { success: true, data: [] };
        }
    },

    getLeaderboard: async () => {
        try {
            const response = await api.get('/social/leaderboard');
            return response;
        } catch (error) {
            // Return empty leaderboard if backend fails
            return { success: true, data: [] };
        }
    },

    getFriends: async () => {
        try {
            const response = await api.get('/social/friends');
            if (response?.success && response?.data) {
                // Backend has data, use it and sync to localStorage
                saveLocalFriends(response.data);
                return response;
            }
        } catch (error) {
            console.log('Backend unavailable, using local friends');
        }

        // Fallback to localStorage
        const localFriends = getLocalFriends();
        return { success: true, data: localFriends };
    },

    addFriend: async (friendId) => {
        try {
            const response = await api.post(`/social/friends/${friendId}`, {});
            if (response?.success) {
                // Return success, let UI handle the pending state
                return response;
            }
        } catch (error) {
            console.log('Backend unavailable, fallback to mock');
        }

        // Fallback to localStorage (Mock behavior: Auto-accept for demo if offline)
        const localFriends = getLocalFriends();
        const userToAdd = MOCK_USERS.find(u => u.id === friendId);
        if (userToAdd) {
            const alreadyFriends = localFriends.some(f => f.id === friendId);
            if (!alreadyFriends) {
                const updatedFriends = [...localFriends, userToAdd];
                saveLocalFriends(updatedFriends);
                return { success: true, message: 'Friend added (Offline Mode)' };
            }
        }
        return { success: false, message: 'Failed to add friend' };
    },

    getPendingRequests: async () => {
        try {
            const response = await api.get('/social/friends/requests');
            return response;
        } catch (error) {
            return { success: true, data: [] }; // Mock: No pending requests in offline mode
        }
    },

    acceptRequest: async (requestId) => {
        try {
            const response = await api.post(`/social/friends/requests/${requestId}/accept`, {});
            return response;
        } catch (error) {
            return { success: false, message: 'Backend unavailable' };
        }
    },

    declineRequest: async (requestId) => {
        try {
            const response = await api.post(`/social/friends/requests/${requestId}/decline`, {});
            return response;
        } catch (error) {
            return { success: false, message: 'Backend unavailable' };
        }
    },

    searchUsers: async (searchTerm) => {
        try {
            const response = await api.get(`/social/search?term=${searchTerm}`);
            if (response?.success && response?.data) {
                return response;
            }
        } catch (error) {
            console.log('Backend unavailable, searching mock users');
        }

        // Fallback to mock users
        const term = searchTerm.toLowerCase();
        const localFriends = getLocalFriends();
        const friendIds = new Set(localFriends.map(f => f.id));

        // Filter out current friends and search
        const results = MOCK_USERS
            .filter(user => !friendIds.has(user.id))
            .filter(user =>
                user.userName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );

        return { success: true, data: results };
    },

    // New method to remove friend
    removeFriend: async (friendId) => {
        try {
            const response = await api.delete(`/social/friends/${friendId}`);
            if (response?.success) {
                return response;
            }
        } catch (error) {
            console.log('Backend unavailable, removing friend locally');
        }

        // Fallback to localStorage
        const localFriends = getLocalFriends();
        const updatedFriends = localFriends.filter(f => f.id !== friendId);
        saveLocalFriends(updatedFriends);
        return { success: true, message: 'Friend removed successfully!' };
    },

    // New method to get all users for browsing (Instagram-style)
    getAllUsers: async () => {
        try {
            // Try to fetch real users from backend FIRST
            const response = await api.get('/social/users/all');
            if (response?.success && response?.data && response.data.length > 0) {
                console.log('✅ Loaded real users from backend:', response.data.length);
                return { success: true, data: response.data };
            }
        } catch (error) {
            console.log('⚠️ Backend unavailable, using mock users');
        }

        // Fallback to mock users only if backend fails or returns empty
        console.log('📝 Using mock users as fallback');
        return { success: true, data: MOCK_USERS };
    },

    // New method to get user profile by ID
    getUserProfile: async (userId) => {
        try {
            const response = await api.get(`/social/users/${userId}`);
            if (response?.success && response?.data) {
                return response;
            }
        } catch (error) {
            console.log('Backend unavailable, using mock data');
        }

        // Find user in mock data
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
            return { success: true, data: user };
        }

        return { success: false, message: 'User not found' };
    }
};

export default socialService;
