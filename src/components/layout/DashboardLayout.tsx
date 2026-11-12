import { Sidebar } from "./Sidebar";
import { Header, type AdminAlertItem, type AdminUserMeta } from "./Header";

export function DashboardLayout({
  children,
  adminUser,
  alerts = [],
}: {
  children: React.ReactNode;
  adminUser?: AdminUserMeta;
  alerts?: AdminAlertItem[];
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header adminUser={adminUser} initialAlerts={alerts} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
