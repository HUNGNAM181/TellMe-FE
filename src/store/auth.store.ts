import { create } from "zustand";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string, permissions: string[]) => void;
  clearAuth: () => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,
  setAuth: (user, token, permissions) =>
    set({
      user,
      token,
      permissions,
      isAuthenticated: true,
    }),
  clearAuth: () =>
    set({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
    }),

  setUser: (user) => set({ user }),
}));
