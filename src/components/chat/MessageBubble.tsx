import React from "react";
import clsx from "clsx";
import { Message } from "../../types/chat.types";
import { formatLocalTime } from "@/lib/utils";

interface MessageBubbleProps {
  msg: Message;
}

function MessageBubbleComponent({ msg }: MessageBubbleProps) {
  const htmlContent = msg.text.replace(/\\n/g, "<br/>");

  return (
    <div
      className={clsx(
        "max-w-[70%] rounded-2xl p-3 flex flex-col",
        msg.isReply
          ? "bg-blue-600 text-white self-end rounded-br-sm"
          : "bg-white text-gray-800 self-start border border-gray-200 shadow-sm rounded-bl-sm",
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      {msg.createdAt && (
        <span className={clsx("text-[11px] mt-1 text-right", msg.isReply ? "text-blue-200" : "text-gray-400")}>
          {formatLocalTime(msg.createdAt)}
        </span>
      )}
    </div>
  );
}

export const MessageBubble = React.memo(MessageBubbleComponent, (prevProps, nextProps) => {
  return prevProps.msg.id === nextProps.msg.id && prevProps.msg.text === nextProps.msg.text;
});
