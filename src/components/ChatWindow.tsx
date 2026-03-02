"use client";

import { useEffect, useState, useRef } from "react";
import { Send, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { chatService } from "../services/chat.service";
import { Message } from "../types/chat.types";
import clsx from "clsx";

interface ChatWindowProps {
  psid: string | null;
}

export function ChatWindow({ psid }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!psid) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await chatService.getHistory(psid);
        if (isMounted) {
          setMessages(res.data || []);
          setTimeout(scrollToBottom, 50);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử tin nhắn của", psid, error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();

    const interval = setInterval(async () => {
      if (!isMounted) return;
      try {
        const res = await chatService.getHistory(psid);
        if (isMounted && res.data) {
          setMessages(res.data);
        }
      } catch (err) {
        // bỏ qua
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [psid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!psid || !inputText.trim() || sending) return;

    try {
      setSending(true);
      const textToSend = inputText.trim();
      setInputText("");

      const optimisticMessage: Message = {
        id: Date.now().toString(),
        senderPsid: psid, // page message => we usually need the page ID, but here psid is customer's.
        text: textToSend,
        isReply: true,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);
      scrollToBottom();

      await chatService.sendMessage({ psid, text: textToSend });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      alert("Lỗi khi gửi tin nhắn, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  if (!psid) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 h-full">
        <MessageCircleIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-600">Chưa chọn hội thoại nào</h2>
        <p className="text-gray-500 mt-2">Chọn một khách hàng từ danh sách bên trái để bắt đầu chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex justify-center items-center">
            <User className="text-blue-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{psid.substring(0, 8)}</h2>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Đang hoạt động
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào. Bắt đầu trò chuyện ngay!</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={clsx(
                "max-w-[70%] rounded-2xl p-3 flex flex-col",
                msg.isReply
                  ? "bg-blue-600 text-white self-end rounded-br-sm"
                  : "bg-white text-gray-800 self-start border border-gray-200 shadow-sm rounded-bl-sm",
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\\n/g, "<br/>") }} />
              {msg.createdAt && (
                <span className={clsx("text-[11px] mt-1 text-right", msg.isReply ? "text-blue-200" : "text-gray-400")}>
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    locale: vi,
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end bg-gray-100 rounded-3xl p-1 pr-2 relative focus-within:ring-2 ring-blue-500 focus-within:bg-white transition-all shadow-inner"
        >
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Nhập tin nhắn..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-gray-800"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors mb-1 ml-2"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}
