"use client";

import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import { MessageCircle, User, ArrowLeft } from "lucide-react";
import { chatService } from "../services/chat.service";
import { webSocketService } from "../services/webSocket.service";
import { Customer, Message } from "../types/chat.types";
import { ChatInput } from "./chat/ChatInput";
import { MessageBubble } from "./chat/MessageBubble";
import { formatDateSeparator } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ChatWindowProps {
  psid: string | null;
}

export function ChatWindow({ psid }: ChatWindowProps) {
  const params = useParams();
  const platform = (params?.platform as string) || "facebook";

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [timeVisibleInfo, setTimeVisibleInfo] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const prevScrollHeightRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchHistory = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (!psid || isFetchingRef.current || (!hasMore && !isRefresh)) return;

      try {
        isFetchingRef.current = true;
        setIsFetching(true);
        if (isRefresh) setLoading(true);

        const res = await chatService.getHistory(psid, { page: pageNum, limit: 20 });

        setCustomer(res.customer || null);
        const newData = res.data || [];

        if (!isRefresh && scrollContainerRef.current) {
          prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }

        setMessages((prev) => {
          if (isRefresh) return newData.reverse();

          const reversedNewData = [...newData].reverse();

          const existingIds = new Set(prev.map((m) => m.id));
          const filteredNew = reversedNewData.filter((m) => !existingIds.has(m.id));

          return [...filteredNew, ...prev];
        });

        setHasMore(newData.length === 20);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử tin nhắn của", psid, error);
      } finally {
        isFetchingRef.current = false;
        setIsFetching(false);
        if (isRefresh) {
          setLoading(false);
          setTimeout(scrollToBottom, 50);
        }
      }
    },
    [psid, hasMore],
  );

  useEffect(() => {
    if (prevScrollHeightRef.current !== null && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const heightDiff = container.scrollHeight - prevScrollHeightRef.current;

      container.scrollTop += heightDiff;
      prevScrollHeightRef.current = null;
    }
  }, [messages]);

  useEffect(() => {
    if (!psid) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      setReplyingTo(null);
      prevScrollHeightRef.current = null;
      return;
    }

    setPage(1);
    setHasMore(true);
    let isMounted = true;

    if (isMounted) fetchHistory(1, true);

    const handleNewMessage = (msg: Message) => {
      const isRelevant = msg.senderPsid === psid;

      if (isRelevant) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setTimeout(scrollToBottom, 100);
      }
    };

    webSocketService.on("ReceiveNewMessage", handleNewMessage);

    return () => {
      isMounted = false;
      webSocketService.off("ReceiveNewMessage", handleNewMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [psid]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (el.scrollTop === 0 && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage);
    }
  }, [page, hasMore, isFetching, fetchHistory]);

  if (!psid) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 h-full">
        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-600">Chưa chọn hội thoại nào</h2>
        <p className="text-gray-500 mt-2">Chọn một khách hàng từ danh sách bên trái để bắt đầu chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/${platform}`} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="relative w-12 h-12 shrink-0">
            {customer?.avatarUrl ? (
              <Image
                src={customer.avatarUrl}
                alt={customer.name || "Avatar"}
                fill
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">{customer?.name ?? "Khách hàng"}</h2>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4 bg-gray-50 flex flex-col"
      >
        {isFetching && !loading && (
          <div className="flex justify-center items-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}

        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 flex-1">Chưa có tin nhắn nào. Bắt đầu trò chuyện ngay!</div>
        ) : (
          messages.map((msg, index) => {
            const currentDateStr = new Date(msg.createdAt).toDateString();
            let isNewDay = false;

            if (index === 0) {
              isNewDay = true;
            } else {
              const prevDateStr = new Date(messages[index - 1].createdAt).toDateString();
              if (currentDateStr !== prevDateStr) {
                isNewDay = true;
              }
            }

            return (
              <Fragment key={msg.id || index}>
                {isNewDay && (
                  <div className="flex justify-center my-6">
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full shadow-sm">
                      {formatDateSeparator(msg.createdAt)}
                    </span>
                  </div>
                )}
                <MessageBubble
                  msg={msg}
                  messages={messages}
                  onReply={() => setReplyingTo(msg)}
                  showTimeInfo={timeVisibleInfo === msg.id}
                  onToggleTime={() => setTimeVisibleInfo((prev: string | null) => (prev === msg.id ? null : msg.id))}
                />
              </Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput psid={psid} replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />
    </div>
  );
}
