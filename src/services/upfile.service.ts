import { UploadAvatarResponse } from "@/types/upload-avatar.type";
import apiClient from "@/lib/axios.client";
import { ApiResponse } from "@/types/api.types";

export const fileService = {
  uploadAvatar: async (file: File): Promise<ApiResponse<UploadAvatarResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const data = await apiClient.post<ApiResponse<UploadAvatarResponse>, ApiResponse<UploadAvatarResponse>>(
      "/api/File/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },
};

export default fileService;
