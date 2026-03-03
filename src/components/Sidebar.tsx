"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { chatService } from "../services/chat.service";
import { webSocketService } from "../services/webSocket.service";
import { Conversation, Message } from "../types/chat.types";
import { ConversationItem } from "./chat/ConversationItem";

interface SidebarProps {
  selectedPsid: string | null;
}

export function Sidebar({ selectedPsid }: SidebarProps) {
  const params = useParams();
  const platform = (params?.platform as string) || "facebook";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFetchingRef = useRef(false);

  const listRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (isFetchingRef.current || (!hasMore && !isRefresh)) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);
        if (isRefresh) setLoading(true);

        const res = await chatService.getConversations({ page: pageNum, limit: 20 });
        const newData = res.data || [];

        setConversations((prev) => {
          if (isRefresh) return newData;
          const newIds = new Set(newData.map((c) => c.senderPsid));
          const filteredPrev = prev.filter((c) => !newIds.has(c.senderPsid));
          return [...filteredPrev, ...newData];
        });

        setHasMore(newData.length === 20);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cuộc hội thoại:", error);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        if (isRefresh) setLoading(false);
      }
    },
    [hasMore],
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchConversations(1, true);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      const conversationPsid = msg.senderPsid;
      if (!conversationPsid) return;

      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c.senderPsid === conversationPsid);

        if (existingIndex > -1) {
          const updatedConv = {
            ...prev[existingIndex],
            lastInteractionAt: msg.createdAt || new Date().toISOString(),
            totalMessages: (prev[existingIndex].totalMessages || 0) + 1,
            lastMessageText: msg.text,
            lastMessageIsReply: msg.isReply,
          };
          const rawList = [...prev];
          rawList.splice(existingIndex, 1);
          return [updatedConv, ...rawList];
        } else {
          fetchConversations(1, true);
          return prev;
        }
      });
    };

    webSocketService.on("ReceiveNewMessage", handleNewMessage);

    return () => {
      webSocketService.off("ReceiveNewMessage", handleNewMessage);
    };
  }, [fetchConversations]);

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;

    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;

    if (isAtBottom && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchConversations(nextPage);
    }
  }, [page, hasMore, isFetching, fetchConversations]);

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6.5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          Hội thoại
        </h2>
      </div>

      <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không có cuộc hội thoại nào</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.senderPsid}
                conv={conv}
                isSelected={selectedPsid === conv.senderPsid}
                platform={platform}
              />
            ))}
          </ul>
        )}

        {isFetching && !loading && <div className="p-4 text-center text-sm text-gray-400">Đang tải thêm...</div>}
      </div>
    </div>
  );
}
