import axios from 'axios';

const api = axios.create({
    baseURL: 'https://tendermanagementsystem-production.up.railway.app/api', // Spring Boot backend URL
});

// Configure interceptor to add authorization token
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.token) {
                config.headers['Authorization'] = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
