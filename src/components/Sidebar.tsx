"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { chatService } from "../services/chat.service";
import { webSocketService } from "../services/webSocket.service";
import { Conversation, Message } from "../types/chat.types";
import { ConversationItem } from "./chat/ConversationItem";

interface SidebarProps {
  selectedPsid: string | null;
}

export function Sidebar({ selectedPsid }: SidebarProps) {
  const params = useParams();
  const router = useRouter();

  const platform = (params?.platform as string) || "facebook";

  const platformName =
    platform === "facebook"
      ? "Facebook Inbox"
      : platform === "tiktok"
        ? "TikTok Inbox"
        : platform === "shopee"
          ? "Shopee Inbox"
          : "Inbox";

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

        const res = await chatService.getConversations({
          page: pageNum,
          limit: 20,
        });

        const newData = res.data || [];

        setConversations((prev) => {
          if (isRefresh) return newData;

          const newIds = new Set(newData.map((c) => c.senderPsid));
          const filteredPrev = prev.filter((c) => !newIds.has(c.senderPsid));

          return [...filteredPrev, ...newData];
        });

        setHasMore(newData.length === 20);
      } catch (error) {
        console.error("Error loading conversations:", error);
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
  }, [fetchConversations]);

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
      <div className="p-4 border-b border-gray-200 flex flex-col gap-2">
        <button
          onClick={() => router.push("/dashboard/conversations")}
          className="
            flex items-center gap-2
            text-sm text-gray-500
            hover:text-gray-800
            transition
          "
        >
          <ArrowLeft className="w-4 h-4" />
          All Inboxes
        </button>

        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          {platformName}
        </h2>
      </div>

      <div ref={listRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations found</div>
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

        {isFetching && !loading && <div className="p-4 text-center text-sm text-gray-400">Loading more...</div>}
      </div>
    </div>
  );
}
