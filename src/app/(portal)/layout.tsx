import { redirect } from "next/navigation";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";
import { CustomerHeader } from "@/components/layout/CustomerHeader";
import { fetchCustomerMe, fetchCustomerNotifications } from "@/lib/customerApi";
import { getCustomerSession } from "@/lib/auth";

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) {
    redirect("/?login=1");
  }

  const [meRes, notifRes] = await Promise.all([
    fetchCustomerMe(),
    fetchCustomerNotifications(),
  ]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <CustomerHeader
          user={meRes.data}
          notifications={notifRes.notifications}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
