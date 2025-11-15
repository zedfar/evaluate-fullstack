import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios";
import { API_CONFIG, ERROR_MESSAGES } from "@/utils/constants";
import type { ApiError } from "@/types/api.types";
import { useAuthStore } from "@/store/auth";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor → tambahkan token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor → handle 401 with conditional refresh token
    this.api.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };
        const status = error.response?.status;

        // Handle 401 Unauthorized
        if (status === 401 && !originalRequest._retry) {
          const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

          // Kondisi 1: USE_REFRESH_TOKEN = true → coba refresh token
          if (API_CONFIG.USE_REFRESH_TOKEN && refreshToken) {
            originalRequest._retry = true;
            try {
              const { data } = await axios.post<{ access_token: string }>(
                `${API_CONFIG.BASE_URL}auth/refresh`,
                { refresh_token: refreshToken }
              );
              const newAccessToken = data.access_token;

              // Update tokens di store
              setTokens(newAccessToken, refreshToken);

              // Retry original request dengan token baru
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.api(originalRequest);
            } catch (refreshError) {
              // Refresh token gagal → logout
              console.error("Refresh token failed:", refreshError);
              clearAuth();
              window.location.href = "/login";
            }
          }
          // Kondisi 2: USE_REFRESH_TOKEN = false → langsung logout
          else {
            clearAuth();
            window.location.href = "/login";
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const data: any = error.response.data;
      return {
        message: data.message || ERROR_MESSAGES.SERVER_ERROR,
        status: error.response.status,
        errors: data.errors,
      };
    } else if (error.request) {
      return { message: ERROR_MESSAGES.NETWORK_ERROR, status: 0 };
    } else {
      return { message: error.message || ERROR_MESSAGES.SERVER_ERROR };
    }
  }

  async get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.get<T>(url, { ...config, params });
    return res.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.post<T>(url, data, config);
    return res.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.put<T>(url, data, config);
    return res.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.patch<T>(url, data, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.api.delete<T>(url, config);
    return res.data;
  }

  // Method untuk mendapatkan axios instance (jika perlu custom config)
  getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

export const api = new ApiService();
