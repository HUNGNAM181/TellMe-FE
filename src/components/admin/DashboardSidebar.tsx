"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, MessageCircle, Users, LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";

const sidebarItems = [
  {
    name: "Social Commerce Inbox",
    path: "/dashboard/conversations",
    icon: MessageCircle,
  },
  {
    name: "User Management",
    path: "/dashboard/user-management",
    icon: Users,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/signin");
  };

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/dashboard/conversations" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>

          <div>
            <h2 className="font-bold text-lg">TellMe AI</h2>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const active = pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active ? "bg-purple-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
