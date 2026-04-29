const TOKEN_KEY = 'ahq_user_token';

const setToken = (token) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem('token');
};

const getToken = () => {
    const sessionToken = sessionStorage.getItem(TOKEN_KEY);
    if (sessionToken) return sessionToken;

    // One-time migration path from old storage key.
    const legacyToken = localStorage.getItem('token');
    if (legacyToken) {
        sessionStorage.setItem(TOKEN_KEY, legacyToken);
        localStorage.removeItem('token');
        return legacyToken;
    }

    return null;
};

const removeToken = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
};

const isLoggedIn = () => {
    const token = getToken();
    if (!token) return false;

    // Simple check if token is expired (decoded base64)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    } catch (e) {
        return false;
    }
};

const getUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const isAdmin = () => {
    return isLoggedIn() && getUser()?.role === 'admin';
};

const logout = () => {
    removeToken();
    window.location.href = '/index.html';
};

const adminLogout = () => {
    removeToken();
    window.location.href = '/admin/login.html';
};

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = 'xp-notification animate-slide-up';
    notification.style.backgroundColor = type === 'error' ? 'var(--error)' : 'var(--neon-green)';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('animate-fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
};
