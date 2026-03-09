import apiClient from "@/lib/axios.client";
import { LoginRequest, AuthUser, AuthResponseData } from "@/types/auth.types";
import { ApiResponse } from "@/types/api.types";
import { useAuthStore } from "@/store/auth.store";

let currentUserPromise: Promise<AuthUser | null> | null = null;

function shouldRefresh(tokenExpiresAt: string | null) {
  if (!tokenExpiresAt) return false;

  return new Date(tokenExpiresAt).getTime() - Date.now() < 60 * 1000;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponseData> {
    const result = (await apiClient.post("/api/Users/login", data)) as unknown as ApiResponse<AuthResponseData>;

    if (result.isSuccess && result.data) {
      const { user, token, refreshToken, permissions, expiresAt, refreshTokenExpiresAt } = result.data;

      useAuthStore.getState().setAuth(user, token, refreshToken, permissions, expiresAt, refreshTokenExpiresAt);

      return result.data;
    }

    throw new Error(result.errorMessage || "Login failed");
  },

  async refresh(): Promise<AuthResponseData | null> {
    const { refreshToken } = useAuthStore.getState();

    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return null;
    }

    const result = (await apiClient.post("/api/Users/refresh", {
      refreshToken,
    })) as unknown as ApiResponse<AuthResponseData>;

    if (result.isSuccess && result.data) {
      const { user, token, refreshToken: newRefreshToken, permissions, expiresAt, refreshTokenExpiresAt } = result.data;

      useAuthStore.getState().setAuth(user, token, newRefreshToken, permissions, expiresAt, refreshTokenExpiresAt);

      return result.data;
    }

    useAuthStore.getState().clearAuth();
    return null;
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const store = useAuthStore.getState();

    if (store.user && store.token && !shouldRefresh(store.tokenExpiresAt)) {
      return store.user;
    }

    if (currentUserPromise) return currentUserPromise;

    currentUserPromise = (async () => {
      try {
        const data = await this.refresh();
        return data?.user || null;
      } catch (error) {
        console.error("Refresh failed", error);
        useAuthStore.getState().clearAuth();
        return null;
      }
    })();

    return currentUserPromise.finally(() => {
      currentUserPromise = null;
    });
  },

  async logout(): Promise<void> {
    const { refreshToken } = useAuthStore.getState();

    try {
      if (refreshToken) {
        await apiClient.post("/api/Users/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      useAuthStore.getState().clearAuth();
      localStorage.removeItem("auth-storage");
    }
  },
};
