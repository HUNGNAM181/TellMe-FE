import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Image as ImageIcon, Sticker, X } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { chatService } from "../../services/chat.service";

import { Message } from "../../types/chat.types";

interface ChatInputProps {
  psid: string;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

function ChatInputComponent({ psid, replyingTo, onCancelReply }: ChatInputProps) {
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showStickerMenu, setShowStickerMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
        setShowStickerMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
    }
  }, [inputText]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!psid || !inputText.trim() || sending) return;

    try {
      setSending(true);
      const textToSend = inputText.trim();
      setInputText("");
      setShowEmojiPicker(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      await chatService.sendMessage({
        psid,
        text: textToSend,
        ...(replyingTo ? { replyToId: replyingTo.id } : {}),
      });

      if (onCancelReply) onCancelReply();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      alert("Lỗi khi gửi tin nhắn, vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setInputText((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="p-3 bg-white border-t border-gray-200 shrink-0 relative">
      <div ref={popupRef}>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-16 z-50 shadow-2xl rounded-lg">
            <EmojiPicker onEmojiClick={onEmojiClick} searchPlaceHolder="Tìm kiếm..." />
          </div>
        )}

        {showStickerMenu && (
          <div className="absolute bottom-20 left-4 z-50 w-72 h-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-2">Nhãn dán</h3>
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Khu vực danh sách Sticker...
            </div>
          </div>
        )}
      </div>

      {replyingTo && (
        <div className="flex items-center justify-between mb-2 px-4 py-2 bg-gray-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-blue-600 mb-0.5">
              Đang trả lời {replyingTo.isReply ? "chính bạn" : "khách hàng"}
            </p>
            <p className="text-sm text-gray-500 truncate">{replyingTo.text}</p>
          </div>
          {onCancelReply && (
            <X className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" onClick={onCancelReply} />
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-end gap-2">
        <div className="flex items-center gap-1 mb-1.5 pl-1">
          <button
            type="button"
            onClick={() => {
              setShowStickerMenu(!showStickerMenu);
              setShowEmojiPicker(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              showStickerMenu ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-blue-600 hover:bg-gray-100"
            }`}
          >
            <Sticker className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex items-end bg-gray-100 rounded-3xl p-1 pr-1 relative focus-within:ring-2 ring-blue-500 focus-within:bg-white transition-all shadow-inner">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aa"
            className="flex-1 max-h-32 scrollbar-thin bg-transparent border-none resize-none py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-0 leading-tight"
            rows={1}
            style={{ minHeight: "40px" }}
          />

          <button
            type="button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowStickerMenu(false);
            }}
            className={`p-1.5 mb-0.5 mr-1 rounded-full transition-colors cursor-pointer ${
              showEmojiPicker ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="w-10 h-10 mb-1 shrink-0 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}

export const ChatInput = React.memo(ChatInputComponent);
