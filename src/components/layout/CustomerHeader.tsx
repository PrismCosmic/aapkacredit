"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, User, LogOut, CheckCircle2, Clock } from "lucide-react";
import { customerLogoutAction } from "@/app/actions/customer-auth";
import type { CustomerNotification, CustomerUser } from "@/lib/customerApi";

interface CustomerHeaderProps {
  user?: CustomerUser | null;
  notifications?: CustomerNotification[];
}

export function CustomerHeader({ user, notifications = [] }: CustomerHeaderProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayName = user?.full_name?.trim() || "Borrower";
  const displaySub = user?.mobile_number ? `+91 ${user.mobile_number}` : user?.email || "Verified Customer";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/loans?q=${encodeURIComponent(q)}` : "/loans");
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      <form onSubmit={handleSearch} className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search loans by ID, status, or amount..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </form>

      <div className="flex items-center gap-3 relative">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs((v) => !v)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-card border border-border shadow-xl z-30 overflow-hidden">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-sm font-semibold">Notifications</span>
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    You have no notifications yet.
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <Link
                      key={n.id}
                      href="/notifications"
                      onClick={() => setShowNotifs(false)}
                      className="flex items-start gap-2.5 p-3 hover:bg-muted/40 transition-colors"
                    >
                      {n.is_read ? (
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-3 pl-3 border-l border-border hover:opacity-90 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{displayName}</p>
            <p className="text-xs text-muted-foreground mt-1">{displaySub}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-semibold shadow-sm">
            <User className="w-4 h-4" />
          </div>
        </Link>

        <form action={customerLogoutAction}>
          <button
            type="submit"
            title="Sign out"
            aria-label="Sign out"
            className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
