// import apiClient from "@/lib/axios.client";
// import { LoginRequest, LoginResponse, AuthUser } from "@/types/auth.types";
// import { useAuthStore } from "@/store/auth.store";

// let currentUserPromise: Promise<AuthUser | null> | null = null;

// export const authService = {
//   async login(data: LoginRequest): Promise<LoginResponse> {
//     const response = await apiClient.post<LoginResponse>("/Users/login", data);
//     const result = response.data;

//     if (result.isSuccess && result.data) {
//       const { user, token, permissions } = result.data;

//       useAuthStore.getState().setAuth(user, token, permissions);
//       localStorage.setItem("logged_in", "true");
//     }

//     return result;
//   },

//   async refresh() {
//     const response = await apiClient.post("/Users/refresh");
//     return response.data;
//   },

//   async getCurrentUser(): Promise<AuthUser | null> {
//     const store = useAuthStore.getState();

//     if (store.user && store.token) return store.user;

//     if (currentUserPromise) return currentUserPromise;

//     currentUserPromise = (async () => {
//       try {
//         const response = await apiClient.post("/Users/refresh");
//         const result = response.data;

//         if (result.isSuccess && result.data) {
//           const { user, token, permissions } = result.data;

//           store.setAuth(user, token, permissions);
//           localStorage.setItem("logged_in", "true");

//           return user;
//         }
//       } catch (error) {
//         localStorage.removeItem("logged_in");
//         return null;
//       }

//       return null;
//     })();

//     return currentUserPromise.finally(() => {
//       currentUserPromise = null;
//     });
//   },

//   async logout(): Promise<void> {
//     try {
//       await apiClient.post("/Users/logout");
//     } catch (error) {
//       console.error("Logout failed", error);
//     } finally {
//       useAuthStore.getState().clearAuth();
//       localStorage.removeItem("logged_in");
//     }
//   },
// };
