import { Pagination } from "@/types/api.types";
import apiClient from "../lib/axios.client";
import { UserDto, CreateUserPayload, UpdateUserPayload } from "@/types/user.types";
import { ApiResponse } from "../types/api.types";

export const userService = {
  getUsers: async (params?: Pagination): Promise<ApiResponse<UserDto[]>> => {
    const { page = 1, limit = 20 } = params || {};

    const data = await apiClient.get<ApiResponse<UserDto[]>, ApiResponse<UserDto[]>>("/api/Users", {
      params: { pageNumber: page, pageSize: limit },
    });

    return data;
  },

  getUserById: async (id: string): Promise<ApiResponse<UserDto>> => {
    const data = await apiClient.get<ApiResponse<UserDto>, ApiResponse<UserDto>>(`/api/Users/${id}`);

    return data;
  },

  createUser: async (payload: CreateUserPayload): Promise<ApiResponse<UserDto>> => {
    const data = await apiClient.post<ApiResponse<UserDto>, ApiResponse<UserDto>>("/api/Users", payload);

    return data;
  },

  updateUser: async (id: string, payload: UpdateUserPayload): Promise<ApiResponse<UserDto>> => {
    const data = await apiClient.put<ApiResponse<UserDto>, ApiResponse<UserDto>>(`/api/Users/${id}`, payload);

    return data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<boolean>> => {
    const data = await apiClient.delete<ApiResponse<boolean>, ApiResponse<boolean>>(`/api/Users/${id}`);

    return data;
  },
};

export default userService;
