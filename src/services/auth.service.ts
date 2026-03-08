import apiClient from "@/lib/axios.client";
import { LoginRequest, AuthUser, AuthResponseData } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";
import { useAuthStore } from "@/store/auth.store";

let currentUserPromise: Promise<AuthUser | null> | null = null;

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponseData> {
    const result = (await apiClient.post("/api/Users/login", data)) as unknown as ApiResponse<AuthResponseData>;

    if (result.isSuccess && result.data) {
      const { user, token, refreshToken, permissions } = result.data;

      useAuthStore.getState().setAuth(user, token, refreshToken, permissions);
      localStorage.setItem("logged_in", "true");

      return result.data;
    }

    throw new Error(result.errorMessage || "Login failed");
  },

  async refresh(): Promise<ApiResponse<AuthResponseData>> {
    const { refreshToken } = useAuthStore.getState();

    return (await apiClient.post("/api/Users/refresh", {
      refreshToken,
    })) as unknown as ApiResponse<AuthResponseData>;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const store = useAuthStore.getState();

    if (store.user && store.token) return store.user;
    if (currentUserPromise) return currentUserPromise;

    currentUserPromise = (async () => {
      try {
        const { refreshToken } = store;
        if (!refreshToken) return null;

        const result = (await apiClient.post("/api/Users/refresh", {
          refreshToken,
        })) as unknown as ApiResponse<AuthResponseData>;

        if (result.isSuccess && result.data) {
          const { user, token, refreshToken: newRefreshToken, permissions } = result.data;

          store.setAuth(user, token, newRefreshToken, permissions);
          localStorage.setItem("logged_in", "true");

          return user;
        }
      } catch (error) {
        localStorage.removeItem("logged_in");
        return null;
      }
      return null;
    })();

    return currentUserPromise.finally(() => {
      currentUserPromise = null;
    });
  },

  async logout(): Promise<void> {
    const { refreshToken } = useAuthStore.getState();

    try {
      await apiClient.post("/api/Users/logout", { refreshToken });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      useAuthStore.getState().clearAuth();
      localStorage.removeItem("logged_in");
    }
  },
};
