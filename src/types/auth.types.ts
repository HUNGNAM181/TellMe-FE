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
export interface LoginRequest {
  username: string;
  password: string;
}
