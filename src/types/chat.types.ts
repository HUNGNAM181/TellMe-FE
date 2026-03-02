export interface Conversation {
  senderPsid: string;
  customerName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  totalMessages: number;
  lastInteractionAt: string;
}

export interface Message {
  id: string;
  senderPsid: string;
  text: string;
  isReply: boolean;
  createdAt: string;
}

export interface SendMessagePayload {
  psid: string;
  text: string;
}

export interface ConversationsResponse {
  data: Conversation[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface HistoryResponse {
  data: Message[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
