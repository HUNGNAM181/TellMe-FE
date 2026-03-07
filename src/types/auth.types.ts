export interface AuthUser {
  id: string;
  username: string;
  profileImageUrl: string;
  email: string;
  name: string;
  isActive: boolean;
}

export interface AuthResponseData {
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: AuthUser;
  permissions: string[];
  expiresAt: string;
}

export interface BackendResponse<T> {
  isSuccess: boolean;
  data: T;
  errorMessage: string | null;
  successMessage: string | null;
  errors: any[];
  total: number | null;
  page: number | null;
  limit: number | null;
  totalPages: number | null;
}

export type LoginResponse = BackendResponse<AuthResponseData>;

export interface LoginRequest {
  username: string;
  password: string;
}
