import axios from "axios";

const apiClient = axios.create({
    validateStatus: () => true,
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// add later interceptors for when request to hand in bearer token for authentication

// add alter interceptors for when response to refresh token if expired

export default apiClient;