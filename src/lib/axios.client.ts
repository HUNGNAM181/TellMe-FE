import axiosOriginal, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7172";

const LOGIN_PATH = "/auth?mode=signin";

const apiClient: AxiosInstance = axiosOriginal.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },

  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/Users/login") &&
      !originalRequest.url?.includes("/api/Users/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token as string}`;
            }

            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().clearAuth();
          window.location.href = LOGIN_PATH;
          return Promise.reject(error);
        }

        const res = await axiosOriginal.post(
          `${API_BASE_URL}/api/Users/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        if (res.data && res.data.isSuccess) {
          const {
            user,
            token,
            refreshToken: newRefreshToken,
            permissions,
            expiresAt,
            refreshTokenExpiresAt,
          } = res.data.data;

          useAuthStore.getState().setAuth(user, token, newRefreshToken, permissions, expiresAt, refreshTokenExpiresAt);

          processQueue(null, token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();
        window.location.href = LOGIN_PATH;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
    });

    // Chuẩn hóa lỗi business theo dạng ApiResult có errorMessage
    const apiResult = error.response?.data as { errorMessage?: string } | undefined;
    if (apiResult?.errorMessage) {
      return Promise.reject(new Error(apiResult.errorMessage));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
