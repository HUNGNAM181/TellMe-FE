import axiosOriginal, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// --- 1. KHỞI TẠO (Giống bản của bạn nhưng nâng timeout lên xíu cho chắc) ---
const apiClient: AxiosInstance = axiosOriginal.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --- 2. REQUEST INTERCEPTOR (Để tự lấy token từ Zustand) ---
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

// Biến phụ trợ cho Silent Refresh (TellMeWeb logic)
let isRefreshing = false;

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- 3. RESPONSE INTERCEPTOR (Gộp bản của bạn và bản Refresh) ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về thẳng cục data (Giống hệt ý bạn muốn)
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 (Unauthorized) - Bắt đầu quy trình Refresh Token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/Users/login") &&
      !originalRequest.url?.includes("/Users/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API Refresh khớp với Backend của bạn
        const res = await axiosOriginal.post(`${API_BASE_URL}/Users/refresh`, {}, { withCredentials: true });
        if (res.data && res.data.isSuccess) {
          const { user, token, permissions } = res.data.data;

          // Cập nhật Store
          useAuthStore.getState().setAuth(user, token, permissions);

          processQueue(null, token);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth(); // Refresh hỏng thì bắt login lại
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Phần console.error giống bản của bạn
    console.error("Lỗi gọi API:", error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
