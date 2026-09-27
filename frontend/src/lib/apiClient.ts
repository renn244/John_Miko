import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  broadcastLogout,
  clearAccessToken,
  getAccessToken,
  saveAccessToken,
} from "./tokenStorage";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

const clientOptions = {
  validateStatus: () => true,
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
};

const apiClient = axios.create(clientOptions);
const refreshClient = axios.create(clientOptions);
let refreshPromise: Promise<string | null> | null = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((response) => {
        if (response.status < 200 || response.status >= 300 || !response.data?.accessToken) {
          return null;
        }

        saveAccessToken(response.data.accessToken);
        return response.data.accessToken as string;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const endAuthenticatedSession = () => {
  clearAccessToken();
  broadcastLogout();

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
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
  const isSessionEndpoint = config.url === "/auth/refresh" || config.url === "/auth/logout";

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

    endAuthenticatedSession();
  }

  return response;
});

export default apiClient;
