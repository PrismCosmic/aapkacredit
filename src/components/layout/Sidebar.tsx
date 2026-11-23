"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  LifeBuoy,
  Activity,
  Banknote,
  UserCheck,
} from "lucide-react";

const operationsNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Credit Checks", href: "/admin/credit-checks", icon: ShieldCheck },
  { name: "Active Loans", href: "/admin/loans", icon: Briefcase },
  { name: "Disbursements", href: "/admin/disbursements", icon: Banknote },
  { name: "Repayments", href: "/admin/repayments", icon: Wallet },
];

const governanceNav = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Staff & Sub-Admins", href: "/admin/subadmins", icon: UserCheck },
  { name: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
  { name: "Audit Trail", href: "/admin/audit-logs", icon: Activity },
  { name: "Analytics & BI", href: "/admin/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">Aapka Credit</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4 space-y-6">
        {/* Operations */}
        <div>
          <h3 className="px-3 text-xs font-medium text-muted-foreground/80 mb-1.5">
            Operations
          </h3>
          <nav className="space-y-0.5">
            {operationsNav.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/admin");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    "group flex items-center rounded-md px-3 py-2 text-xs font-normal transition-colors"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                      "mr-3 h-4 w-4 shrink-0 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Governance & Support */}
        <div>
          <h3 className="px-3 text-xs font-medium text-muted-foreground/80 mb-1.5">
            Governance & support
          </h3>
          <nav className="space-y-0.5">
            {governanceNav.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    "group flex items-center rounded-md px-3 py-2 text-xs font-normal transition-colors"
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                      "mr-3 h-4 w-4 shrink-0 transition-colors"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Settings & Logout */}
        <div className="pt-2 border-t border-border/50">
          <h3 className="px-3 text-xs font-medium text-muted-foreground/80 mb-1.5">
            Configuration
          </h3>
          <Link
            href="/admin/settings"
            className={cn(
              pathname === "/admin/settings"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              "group flex items-center rounded-md px-3 py-2 text-xs font-normal transition-colors"
            )}
          >
            <Settings className="mr-3 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" aria-hidden="true" />
            Platform settings & risk
          </Link>
          <form action={logoutAction} className="mt-1">
            <button
              type="submit"
              className="w-full text-muted-foreground hover:bg-sidebar-accent/50 hover:text-destructive group flex items-center rounded-md px-3 py-2 text-xs font-medium transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-destructive transition-colors" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
