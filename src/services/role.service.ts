import { Pagination } from "@/types/api.types";
import apiClient from "../lib/axios.client";
import { RoleDto, RoleBriefDto, CreateRoleDto, UpdateRoleDto } from "../types/role.type";
import { ApiResponse } from "@/types/api.types";
export const roleService = {
  getRoles: async (params?: Pagination): Promise<ApiResponse<RoleBriefDto[]>> => {
    const { page = 1, limit = 20 } = params || {};
    const data = await apiClient.get<ApiResponse<RoleBriefDto[]>, ApiResponse<RoleBriefDto[]>>("/api/role", {
      params: { pageNumber: page, pageSize: limit },
    });
    return data;
  },

  getRoleById: async (id: string): Promise<ApiResponse<RoleDto>> => {
    const data = await apiClient.get<ApiResponse<RoleDto>, ApiResponse<RoleDto>>(`/api/role/${id}`);
    return data;
  },

  createRole: async (payload: CreateRoleDto): Promise<ApiResponse<RoleDto>> => {
    const data = await apiClient.post<ApiResponse<RoleDto>, ApiResponse<RoleDto>>("/api/role", payload);
    return data;
  },

  updateRole: async (payload: UpdateRoleDto): Promise<ApiResponse<RoleDto>> => {
    const data = await apiClient.put<ApiResponse<RoleDto>, ApiResponse<RoleDto>>("/api/role", payload);
    return data;
  },

  deleteRole: async (id: string): Promise<ApiResponse<boolean>> => {
    const data = await apiClient.delete<ApiResponse<boolean>, ApiResponse<boolean>>(`/api/role/${id}`);
    return data;
  },
};

export default roleService;
