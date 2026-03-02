import { PaginationMeta } from "@/types/api.types";
import apiClient from "../lib/axios.client";
import { ConversationsResponse, HistoryResponse, SendMessagePayload } from "../types/chat.types";

export const chatService = {
  getConversations: async (params?: PaginationMeta): Promise<ConversationsResponse> => {
    const { page = 1, limit = 20 } = params || {};
    const data = await apiClient.get<ConversationsResponse, ConversationsResponse>("/webhook/conversations", {
      params: { page, limit },
    });
    return data;
  },

  getHistory: async (psid: string, params?: PaginationMeta): Promise<HistoryResponse> => {
    const { page = 1, limit = 20 } = params || {};
    const data = await apiClient.get<HistoryResponse, HistoryResponse>(`/webhook/history/${psid}`, {
      params: { page, limit },
    });
    return data;
  },

  sendMessage: async (payload: SendMessagePayload): Promise<void> => {
    const data = await apiClient.post<void, void>("/webhook/send", payload);
    return data;
  },
};
