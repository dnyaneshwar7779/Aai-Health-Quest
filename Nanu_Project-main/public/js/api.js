const API_URL = '/api';

const apiRequest = async (endpoint, options = {}) => {
    const token = typeof getToken === 'function'
        ? getToken()
        : sessionStorage.getItem('ahq_user_token') || localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            // On admin pages, a 401/403 means the session expired — redirect to admin login
            if ((response.status === 401 || response.status === 403) && window.location.pathname.startsWith('/admin/')) {
                if (typeof removeToken === 'function') {
                    removeToken();
                } else {
                    sessionStorage.removeItem('ahq_user_token');
                    localStorage.removeItem('token');
                }
                window.location.href = '/admin/login.html';
                return;
            }
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

const api = {
    // Auth
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getProfile: () => apiRequest('/auth/profile'),
    getWeeklyTasks: () => apiRequest('/auth/tasks/weekly'),
    completeWeeklyTask: (taskId, weight) => apiRequest(`/auth/tasks/weekly/${taskId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ weight })
    }),

    // Workouts
    logWorkout: (workout) => apiRequest('/workouts', { method: 'POST', body: JSON.stringify(workout) }),
    getWorkouts: () => apiRequest('/workouts'),

    // Quests
    getQuests: () => apiRequest('/quests'),
    startQuest: (id) => apiRequest(`/quests/${id}/start`, { method: 'POST' }),
    getActiveQuests: () => apiRequest('/quests/active'),
    updateQuestProgress: (data) => apiRequest('/quests/progress', { method: 'PUT', body: JSON.stringify(data) }),

    // Leaderboard
    getLeaderboard: () => apiRequest('/leaderboard'),
    submitRating: (rating) => apiRequest('/leaderboard/rating', { method: 'POST', body: JSON.stringify({ rating }) }),

    // Redemptions
    getRewards: () => apiRequest('/redemptions/rewards'),
    redeemPoints: (redemptionData) => apiRequest('/redemptions', { method: 'POST', body: JSON.stringify(redemptionData) }),
    getRedemptionHistory: () => apiRequest('/redemptions/history'),

    // Admin
    admin: {
        getUsers: () => apiRequest('/admin/users'),
        getUserWorkouts: (userId) => apiRequest(`/admin/users/${userId}/workouts`),
        getRatings: () => apiRequest('/admin/ratings'),
        createQuest: (quest) => apiRequest('/admin/quests', { method: 'POST', body: JSON.stringify(quest) }),
        updateQuest: (id, quest) => apiRequest(`/admin/quests/${id}`, { method: 'PUT', body: JSON.stringify(quest) }),
        deleteQuest: (id) => apiRequest(`/admin/quests/${id}`, { method: 'DELETE' }),
        approveRating: (id) => apiRequest(`/admin/ratings/${id}/approve`, { method: 'PUT' }),
        deleteRating: (id) => apiRequest(`/admin/ratings/${id}`, { method: 'DELETE' }),
        getMessages: () => apiRequest('/admin/messages'),
        resolveMessage: (id) => apiRequest(`/admin/messages/${id}/respond`, { method: 'POST' }),
        getTransactions: () => apiRequest('/admin/redemptions')
    }
};
