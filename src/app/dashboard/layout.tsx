import DashboardSidebar from "@/components/admin/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto p-6 bg-background">{children}</main>
    </div>
  );
}
