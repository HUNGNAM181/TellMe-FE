export interface PermissionDto {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}

export interface PermissionBriefDto {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

// Role DTOs
export interface RoleDto {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: string; // ISO date string
  permissions: PermissionDto[];
}

export interface RoleBriefDto {
  id: string;
  name: string;
  isActive: boolean;
  permissions: PermissionBriefDto[];
}

// Request payloads for create / update
export interface CreateRoleDto {
  name: string;
  description?: string | null;
  isActive?: boolean; // backend uses `isActive` (optional in client form)
  permissionIds: string[]; // GUIDs of permissions
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: string;
}

// Helper for role forms
export interface RoleFormValues {
  name: string;
  description?: string | null;
  isActive?: boolean;
  permissionIds: string[];
}

// Query params for listing roles
export interface GetRolesQuery {
  pageNumber?: number;
  pageSize?: number;
}