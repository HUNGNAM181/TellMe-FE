import { Pagination } from "@/types/api.types";
import apiClient from "../lib/axios.client";
import {
  RoleDto,
  RoleBriefDto,
  CreateRoleDto,
  UpdateRoleDto
} from "../types/role.type";
import { ApiResult } from "../types/common";
export const roleService = {
  getRoles: async (
    params?: Pagination
  ): Promise<ApiResult<RoleBriefDto[]>> => {
    const { page = 1, limit = 20 } = params || {};
    const data = await apiClient.get<
      ApiResult<RoleBriefDto[]>,
      ApiResult<RoleBriefDto[]>
    >("/api/role", {
      params: { pageNumber: page, pageSize: limit },
    });
    return data;
  },

  getRoleById: async (id: string): Promise<ApiResult<RoleDto>> => {
    const data = await apiClient.get<ApiResult<RoleDto>, ApiResult<RoleDto>>(
      `/api/role/${id}`
    );
    return data;
  },

  createRole: async (payload: CreateRoleDto): Promise<ApiResult<RoleDto>> => {
    const data = await apiClient.post<ApiResult<RoleDto>, ApiResult<RoleDto>>(
      "/api/role",
      payload
    );
    return data;
  },

  updateRole: async (payload: UpdateRoleDto): Promise<ApiResult<RoleDto>> => {
    const data = await apiClient.put<ApiResult<RoleDto>, ApiResult<RoleDto>>(
      "/api/role",
      payload
    );
    return data;
  },

  deleteRole: async (id: string): Promise<ApiResult<boolean>> => {
    const data = await apiClient.delete<ApiResult<boolean>, ApiResult<boolean>>(
      `/api/role/${id}`
    );
    return data;
  },
};

export default roleService;