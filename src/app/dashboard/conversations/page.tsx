"use client";

import { MessageCircle, ChevronRight } from "lucide-react";

export default function ConversationsPage() {
  const items = [
    {
      name: "Facebook Inbox",
      href: "/facebook",
      description: "Manage messages from Facebook",
      color: "from-blue-500 to-blue-600",
      status: "Active",
      active: true,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.017 4.388 10.99 10.125 11.854v-8.385H7.078v-3.47h3.047V9.412c0-3.007 1.79-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.49 0-1.953.925-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.062 24 18.09 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "TikTok Inbox",
      href: "/tiktok",
      description: "View and reply TikTok chats",
      color: "from-gray-400 to-gray-500",
      status: "Inactive",
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M16.5 3c.4 2.1 2 3.7 4.1 4.1v3c-1.6 0-3.1-.5-4.4-1.3v6.2c0 3.2-2.6 5.8-5.8 5.8S4.6 18.2 4.6 15s2.6-5.8 5.8-5.8c.4 0 .8 0 1.1.1v3.1c-.3-.1-.6-.1-.9-.1-1.5 0-2.7 1.2-2.7 2.7S9.1 17.7 10.6 17.7s2.7-1.2 2.7-2.7V3h3.2z" />
        </svg>
      ),
    },
    {
      name: "Shopee Inbox",
      href: "/shopee",
      description: "Handle Shopee customer chats",
      color: "from-gray-400 to-gray-500",
      status: "Inactive",
      active: false,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
          <path d="M6 7V6a6 6 0 0112 0v1h2v14H4V7h2zm2 0h8V6a4 4 0 10-8 0v1zm4 4a3 3 0 110 6 3 3 0 010-6z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 p-8 gap-8">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MessageCircle className="w-5 h-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">Inbox Management</h1>
          <p className="text-sm text-muted-foreground">Manage conversations from all connected platforms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <button
            key={item.name}
            disabled={!item.active}
            onClick={() => item.active && (window.location.href = item.href)}
            className={`
              group
              bg-card
              border
              rounded-lg
              p-5
              text-left
              transition
              ${item.active ? "hover:border-primary hover:shadow-soft" : "opacity-60 cursor-not-allowed"}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-md flex items-center justify-center text-white bg-linear-to-br ${item.color}`}
              >
                {item.icon}
              </div>

              <span
                className={`text-xs px-2 py-1 rounded-md ${
                  item.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.status}
              </span>
            </div>

            <h3 className="font-semibold mb-1">{item.name}</h3>

            <p className="text-sm text-muted-foreground">{item.description}</p>

            <div className={`flex items-center mt-4 text-sm ${item.active ? "text-primary" : "text-gray-400"}`}>
              Open Inbox
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
