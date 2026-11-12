import { Bell, CheckCircle2, Clock, Info, AlertCircle } from "lucide-react";
import Link from "next/link";
import { fetchCustomerNotifications } from "@/lib/customerApi";

export default async function NotificationsPage() {
  const { notifications, ok, error } = await fetchCustomerNotifications();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Loan updates, disbursement alerts, and EMI reminders.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to Overview
        </Link>
      </div>

      {!ok && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || "Unable to load notifications from server."}</span>
        </div>
      )}

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold">No notifications yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              When your KYC is verified, loan offers are generated, or EMIs are scheduled, alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 flex items-start gap-4 transition-colors ${
                  notif.is_read ? "bg-card" : "bg-blue-500/5"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    notif.type?.includes("SUCCESS") || notif.type?.includes("APPROVED")
                      ? "bg-emerald-500/10 text-emerald-500"
                      : notif.type?.includes("ALERT") || notif.type?.includes("OVERDUE")
                      ? "bg-rose-500/10 text-rose-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {notif.is_read ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm">{notif.title}</h3>
                    {!notif.is_read && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                  {notif.created_at && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notif.created_at).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
