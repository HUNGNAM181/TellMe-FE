import React from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { Conversation } from "../../types/chat.types";
import { formatLocalTime, createSlug } from "../../lib/utils";

interface ConversationItemProps {
  conv: Conversation;
  isSelected: boolean;
  platform: string;
}

function ConversationItemComponent({ conv, isSelected, platform }: ConversationItemProps) {
  const usernameSlug = createSlug(conv.customerName || "khach-hang");
  const href = `/${platform}/${conv.senderPsid}/${usernameSlug}`;

  return (
    <li>
      <Link
        href={href}
        prefetch={true}
        className={clsx(
          "w-full text-left flex items-start p-4 hover:bg-gray-50 transition-colors cursor-pointer",
          isSelected && "bg-blue-50 hover:bg-blue-50",
        )}
      >
        <div className="w-12 h-12 relative shrink-0">
          {conv.avatarUrl ? (
            <Image
              src={conv.avatarUrl}
              alt={conv.customerName || "Avatar"}
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
        <div className="ml-4 flex-1 overflow-hidden">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {conv.customerName || `Khách hàng (${conv.senderPsid.substring(0, 8)}...)`}
            </h3>
            {conv.lastInteractionAt && (
              <span className="text-xs text-gray-500 shrink-0 ml-2">{formatLocalTime(conv.lastInteractionAt)}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {conv.lastMessageIsReply ? `Bạn: ${conv.lastMessageText}` : conv.lastMessageText}
          </p>
        </div>
      </Link>
    </li>
  );
}

export const ConversationItem = React.memo(ConversationItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.conv.lastInteractionAt === nextProps.conv.lastInteractionAt &&
    prevProps.conv.totalMessages === nextProps.conv.totalMessages &&
    prevProps.conv.lastMessageText === nextProps.conv.lastMessageText &&
    prevProps.conv.lastMessageIsReply === nextProps.conv.lastMessageIsReply
  );
});
