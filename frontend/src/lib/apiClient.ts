import axios from "axios";

const apiClient = axios.create({
    validateStatus: () => true,
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// add later interceptors for when request to hand in bearer token for authentication
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

// add alter interceptors for when response to refresh token if expired

export default apiClient;