"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "../../components/Sidebar";
import { useWebSocketConnection } from "../../hooks/useWebSocket";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  useWebSocketConnection();

  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  let selectedPsid = null;
  if (pathParts.length >= 2) {
    selectedPsid = pathParts[1];
  }

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      <div className="w-87.5 border-r border-gray-200 bg-white shrink-0">
        <Sidebar selectedPsid={selectedPsid} />
      </div>

      <div className="flex-1 flex flex-col relative min-w-0">{children}</div>
    </div>
  );
}
