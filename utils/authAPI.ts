import axios from 'axios';
import type { AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import directusConfig from '~/configs/directusConfig';

const api = axios.create({
  baseURL: directusConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token to each request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    // Ensure config.headers is properly typed
    if (token && config.headers) {
      (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Extend AxiosRequestConfig to include the `_retry` property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // Allow _retry to be optional
}

// Response interceptor to handle 401 error
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response && error.response.status === 401) {
      // Attempt to refresh the token if we have a refresh token
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried
        try {
          const { data } = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          // Store the new tokens and retry the original request
          localStorage.setItem("access_token", data.data.access_token);
          localStorage.setItem("refresh_token", data.data.refresh_token);

          // Check if headers exist before modifying
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.data.access_token}`;
          }

          return api(originalRequest); // Retry the request with the new token
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Logout if refresh fails
          
        }
      } else {
        // Logout if no refresh token or refresh failed
        
      }
    }

    return Promise.reject(error);
  }
);

export default api;
