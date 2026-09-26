import {
  deleteAccessToken,
  deleteRefreshToken,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/lib/tokenStorage";
import axios, { type InternalAxiosRequestConfig } from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

const clientOptions = {
  validateStatus: () => true,
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
};

const apiClient = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) return null;

      const response = await refreshClient.post("/auth/mobile/refresh", { refreshToken });
      if (response.status < 200 || response.status >= 300 || !response.data?.accessToken || !response.data?.refreshToken) {
        deleteAccessToken();
        await deleteRefreshToken();
        return null;
      }

      saveAccessToken(response.data.accessToken);
      await saveRefreshToken(response.data.refreshToken);
      return response.data.accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(async (response) => {
  const config = response.config as RetriableRequestConfig;
  const requestUsedAccessToken = Boolean(config.headers?.Authorization);
  const isSessionEndpoint =
    config.url === "/auth/mobile/refresh" || config.url === "/auth/mobile/logout";

  if (
    response.status === 401 &&
    requestUsedAccessToken &&
    !config._authRetry &&
    !isSessionEndpoint
  ) {
    config._authRetry = true;
    const token = await refreshAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      return apiClient(config);
    }
  }

  return response;
});

export default apiClient;
