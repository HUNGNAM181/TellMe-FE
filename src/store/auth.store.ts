import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  permissions: string[];
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, token: string, refreshToken: string, permissions: string[], tokenExpiresAt: string) => void;

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
      permissions: [],
      isAuthenticated: false,

      setAuth: (user, token, refreshToken, permissions, tokenExpiresAt) =>
        set({
          user,
          token,
          refreshToken,
          tokenExpiresAt,
          permissions,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
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
    },
  ),
);
