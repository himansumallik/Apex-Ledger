import axios from 'axios';

// Smart URL resolver: guarantees it works even if the Netlify env var isn't injected
const getBaseURL = () => {
    // 1. If Vite injected the env var successfully, use it
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // 2. If running locally, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    
    // 3. Fallback for production (Netlify) if env var is missing
    return 'https://apex-ledger-backend.onrender.com/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;