import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://135.181.42.192',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshAccessToken(); 
                return instance(originalRequest); 
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                throw refreshError;
            }
        }

        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('http://135.181.42.192/accounts/token/refresh/', {
        refresh: refresh_token
    });
    
    const { access } = response.data;
    localStorage.setItem('access_token', access);
};

export default instance;
