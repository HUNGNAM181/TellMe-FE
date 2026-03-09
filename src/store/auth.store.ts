import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (
    user: AuthUser,
    token: string,
    refreshToken: string,
    permissions: string[],
    tokenExpiresAt: string,
    refreshTokenExpiresAt?: string | null,
  ) => void;

  clearAuth: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      permissions: [],
      isAuthenticated: false,

      setAuth: (user, token, refreshToken, permissions, tokenExpiresAt, refreshTokenExpiresAt = null) =>
        set({
          user,
          token,
          refreshToken,
          tokenExpiresAt,
          refreshTokenExpiresAt,
          permissions,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          refreshTokenExpiresAt: null,
          permissions: [],
          isAuthenticated: false,
        }),

      setUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tokenExpiresAt: state.tokenExpiresAt,
        refreshTokenExpiresAt: state.refreshTokenExpiresAt,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
