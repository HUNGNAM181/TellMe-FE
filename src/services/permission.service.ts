import { Pagination } from "@/types/api.types";
import apiClient from "../lib/axios.client";
import { PermissionDto, GetAllRolePermissionQuery } from "../types/permission.type";
import { ApiResult } from "../types/common";

export const permissionService = {
  getAll: async (params?: Pagination): Promise<ApiResult<PermissionDto[]>> => {
    const { page = 1, limit = 20 } = params || {};
    const query: GetAllRolePermissionQuery = { pageNumber: page, pageSize: limit };
    const data = await apiClient.get<ApiResult<PermissionDto[]>, ApiResult<PermissionDto[]>>("/api/permission", {
      params: query,
    });
    return data;
  },
};

export default permissionService;