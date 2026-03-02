"use client";

import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";

export default function Home() {
  const [selectedPsid, setSelectedPsid] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      {/* Sidebar - Cột danh sách khách hàng */}
      <div className="w-[350px] flex-shrink-0 border-r border-gray-200">
        <Sidebar selectedPsid={selectedPsid} onSelect={setSelectedPsid} />
      </div>

      {/* ChatWindow - Cửa sổ chat chính */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <ChatWindow psid={selectedPsid} />
      </div>
    </div>
  );
}
