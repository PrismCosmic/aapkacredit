import { cookies } from "next/headers";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { fetchApi } from "@/lib/apiClient";
import type { AdminAlertItem, AdminUserMeta } from "@/components/layout/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Apka Credit",
  description: "Apka Credit Admin Dashboard",
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const metaRaw = cookieStore.get("admin_meta")?.value;
  let adminUser: AdminUserMeta = { username: "admin", role: "admin" };
  if (metaRaw) {
    try {
      const parsed = JSON.parse(metaRaw);
      if (parsed?.username) {
        adminUser = {
          username: String(parsed.username),
          role: String(parsed.role || "admin"),
        };
      }
    } catch {}
  }

  const alerts: AdminAlertItem[] = [];
  const [disbRes, ticketRes, statsRes] = await Promise.all([
    fetchApi("/admin/disbursements").catch(() => null),
    fetchApi("/admin/support/tickets").catch(() => null),
    fetchApi("/admin/stats").catch(() => null),
  ]);

  const disbursements = Array.isArray(disbRes?.data)
    ? disbRes.data
    : Array.isArray(disbRes)
    ? disbRes
    : [];
  const failedDisb = disbursements.filter(
    (d: any) => d.status === "FAILED" || d.status === "PENDING"
  );
  failedDisb.slice(0, 2).forEach((d: any) => {
    alerts.push({
      id: `disb-${d.id}`,
      title: d.status === "FAILED" ? "Failed IMPS Payout" : "Pending Payout",
      desc: `${d.customer_name || d.loan_id} — ₹${Number(d.amount || 0).toLocaleString("en-IN")}`,
      time: d.status,
      type: "alert",
      href: "/admin/disbursements",
    });
  });

  const tickets = Array.isArray(ticketRes?.data)
    ? ticketRes.data
    : Array.isArray(ticketRes)
    ? ticketRes
    : [];
  const openTickets = tickets.filter((t: any) => t.status === "OPEN");
  openTickets.slice(0, 2).forEach((t: any) => {
    alerts.push({
      id: `tkt-${t.id}`,
      title: `Open Ticket #${t.id}`,
      desc: `${t.customer_name || "Customer"}: ${t.subject}`,
      time: t.priority || "OPEN",
      type: "support",
      href: "/admin/support",
    });
  });

  const pendingApprovals = statsRes?.data?.pending_approvals ?? statsRes?.pending_approvals ?? 0;
  if (pendingApprovals > 0) {
    alerts.push({
      id: "pending-apps",
      title: `${pendingApprovals} Applications Pending Review`,
      desc: "Underwriting / KYC review required in queue.",
      time: "Queue",
      type: "success",
      href: "/admin/applications",
    });
  }

  return (
    <DashboardLayout adminUser={adminUser} alerts={alerts}>
      {children}
    </DashboardLayout>
  );
}
