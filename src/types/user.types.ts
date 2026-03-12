import { RoleDto } from "./role.type";
import { Pagination } from "./api.types";

export interface UserQuery extends Pagination {
  username?: string;
  roleId?: string;
}
export interface UserDto {
  id: string;
  username: string;
  email?: string | null;
  name?: string | null;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  profileImageUrl?: string | null;
  address?: string | null;
  roles: RoleDto[];
}
export interface CreateUserPayload {
  username: string;
  email?: string | null;
  password: string;
  confirmPassword: string;
  name: string;
  isActive?: boolean;
  roleId: string;
  profileImageUrl?: string | null;
}

export interface UpdateUserPayload {
  email?: string | null;
  name?: string | null;
  isActive?: boolean | null;
  roleId?: string | null;
  profileImageUrl?: string | null;
}
