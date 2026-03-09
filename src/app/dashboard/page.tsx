"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  async function handleLogout() {
    await authService.logout();
    router.push("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hello {user?.name || user?.username}</span>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">
        <h2 className="text-2xl font-bold mb-6">Welcome to Dashboard 🚀</h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-gray-500 mt-2">1,245</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Messages</h3>
            <p className="text-gray-500 mt-2">8,532</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">Active Sessions</h3>
            <p className="text-gray-500 mt-2">213</p>
          </div>
        </div>
      </main>
    </div>
  );
}
