export interface PermissionDto {
  id: string;
  name: string;
  description?: string | null;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: string; // ISO date string
}

// Query params used by GET /api/permission
export interface GetAllRolePermissionQuery {
  pageNumber?: number;
  pageSize?: number;
}