import React from "react";
import clsx from "clsx";
import { Message } from "../../types/chat.types";
import { formatLocalTime } from "@/lib/utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";
import { Reply, Smile } from "lucide-react";

interface MessageBubbleProps {
  msg: Message;
  messages?: Message[];
  onReply?: () => void;
  showTimeInfo?: boolean;
  onToggleTime?: () => void;
}

function MessageBubbleComponent({
  msg,
  messages = [],
  onReply,
  showTimeInfo = false,
  onToggleTime,
}: MessageBubbleProps) {
  const htmlContent = msg.text.replace(/\\n/g, "<br/>");

  const replyToMsg = msg.replyToId ? messages.find((m) => m.id === msg.replyToId) : null;

  const senderName = msg.isReply ? "Bạn" : "Khách hàng";
  const repliedToName = replyToMsg?.isReply ? "Bạn" : "Khách hàng";
  const replyHeaderText = `${senderName} đã trả lời ${repliedToName === senderName ? "chính mình" : repliedToName}`;

  return (
    <div className={clsx("flex flex-col mb-4 group relative", msg.isReply ? "items-end" : "items-start")}>
      <div className={clsx("flex gap-2 w-full", msg.isReply ? "flex-row-reverse" : "flex-row")}>
        <div
          onClick={onToggleTime}
          className={clsx(
            "flex flex-col max-w-[70%] relative cursor-pointer",
            msg.isReply ? "items-end" : "items-start",
          )}
        >
          {replyToMsg && (
            <div className={clsx("flex flex-col mb-0.5", msg.isReply ? "items-end" : "items-start")}>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 px-1">
                <Reply className="w-3.5 h-3.5 -scale-x-100" />
                <span>{replyHeaderText}</span>
              </div>

              <div
                className={clsx(
                  "px-3 py-2 rounded-2xl text-sm opacity-90 relative",
                  replyToMsg.isReply ? "bg-[#E5F3FF] text-gray-800" : "bg-[#F0F2F5] text-gray-800",
                  msg.isReply ? "rounded-br-sm" : "rounded-bl-sm",
                )}
              >
                <div className="line-clamp-2 wrap-break-word" dangerouslySetInnerHTML={{ __html: replyToMsg.text }} />
              </div>
            </div>
          )}

          <div className="relative group/bubble">
            <div
              className={clsx(
                "rounded-2xl p-3 flex flex-col relative w-fit transition-transform duration-200 active:scale-[0.98]",
                msg.isReply ? "bg-[#0A7CFF] text-white" : "bg-[#EFEFEF] text-black",
                replyToMsg && (msg.isReply ? "rounded-tr-sm" : "rounded-tl-sm"),
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>

            {msg.createdAt && (
              <div
                className={clsx(
                  "hidden md:block absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] text-gray-400 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 pointer-events-none z-10",
                  msg.isReply ? "right-full mr-2" : "left-full ml-2",
                )}
              >
                {formatLocalTime(msg.createdAt)}
              </div>
            )}
          </div>
        </div>

        {onReply && (
          <div className="flex items-end pb-2">
            <button
              onClick={onReply}
              className="p-1.5 opacity-0 md:group-hover:opacity-100 transition-opacity rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer focus:opacity-100"
              title="Trả lời"
            >
              <Reply className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {msg.createdAt && (
        <div
          className={clsx(
            "md:hidden text-[11px] text-gray-400 px-1 overflow-hidden transition-all duration-300 ease-in-out",
            showTimeInfo ? "max-h-12 opacity-100 mt-1" : "max-h-0 opacity-0 mt-0",
          )}
        >
          {formatLocalTime(msg.createdAt)}
        </div>
      )}
    </div>
  );
}

export const MessageBubble = React.memo(MessageBubbleComponent, (prevProps, nextProps) => {
  return prevProps.msg.id === nextProps.msg.id && prevProps.msg.text === nextProps.msg.text;
});
