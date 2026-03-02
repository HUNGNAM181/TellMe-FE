"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { User, MessageCircle } from "lucide-react";
import { chatService } from "../services/chat.service";
import { Conversation } from "../types/chat.types";
import clsx from "clsx";

interface SidebarProps {
  selectedPsid: string | null;
  onSelect: (psid: string) => void;
}

export function Sidebar({ selectedPsid, onSelect }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await chatService.getConversations();
        if (isMounted) {
          setConversations(res.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách cuộc hội thoại:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchConversations();

    // Polling đơn giản để cập nhật tin nhắn mới (Tùy chọn)
    const interval = setInterval(fetchConversations, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          Hội thoại
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">Không có cuộc hội thoại nào</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <li key={conv.senderPsid}>
                <button
                  onClick={() => onSelect(conv.senderPsid)}
                  className={clsx(
                    "w-full text-left flex items-start p-4 hover:bg-gray-50 transition-colors",
                    selectedPsid === conv.senderPsid && "bg-blue-50 hover:bg-blue-50",
                  )}
                >
                  <div className="relative shrink-0">
                    {conv.avatarUrl ? (
                      <Image
                        src={conv.avatarUrl}
                        alt={conv.customerName || "Avatar"}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {conv.customerName || `Khách hàng (${conv.senderPsid})`}
                      </h3>
                      {conv.lastInteractionAt && (
                        <span className="text-xs text-gray-500 shrink-0 ml-2">
                          {formatDistanceToNow(new Date(conv.lastInteractionAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">Tổng tin nhắn: {conv.totalMessages}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
