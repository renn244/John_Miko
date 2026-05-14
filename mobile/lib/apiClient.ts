import { getAccessToken } from "@/lib/tokenStorage";
import axios from "axios";

const apiClient = axios.create({
  validateStatus: () => true,
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;