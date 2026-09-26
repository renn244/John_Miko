import axios from "axios";
import { clearAccessToken, getAccessToken } from "./tokenStorage";

const apiClient = axios.create({
    validateStatus: () => true,
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// add later interceptors for when request to hand in bearer token for authentication
apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

apiClient.interceptors.response.use((response) => {
    const requestUsedAccessToken = Boolean(response.config.headers.Authorization);

    if (response.status === 401 && requestUsedAccessToken) {
        clearAccessToken();

        if (window.location.pathname !== '/login') {
            window.location.replace('/login');
        }
    }

    return response;
});

export default apiClient;
