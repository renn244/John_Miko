import axios from "axios";

const apiClient = axios.create({
    validateStatus: () => true,
    baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000/api",
    headers: {
        'Content-Type': 'application/json',
    }
})

export default apiClient;