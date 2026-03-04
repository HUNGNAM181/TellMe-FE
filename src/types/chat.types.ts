export interface Conversation {
  senderPsid: string;
  customerName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  lastMessageIsReply: boolean;
  lastMessageText: string;
  totalMessages: number;
  lastInteractionAt: string;
}

export interface Message {
  id: string;
  senderPsid: string;
  recipientId?: string;
  text: string;
  isReply: boolean;
  createdAt: string;
  replyToId: string | null;
  forwardedMessageId: string | null;
}

export interface SendMessagePayload {
  psid: string;
  text: string;
  replyToId?: string;
  forwardedMessageId?: string;
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

export interface Customer {
  psid: string;
  name: string;
  avatarUrl: string;
}
export interface HistoryResponse {
  customer: Customer;
  data: Message[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
