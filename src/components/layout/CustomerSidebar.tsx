"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { customerLogoutAction } from "@/app/actions/customer-auth";
import {
  LayoutDashboard,
  Wallet,
  Settings,
  LogOut,
  FilePlus2,
  Bell
} from "lucide-react";
import Image from "next/image";
import whitelogo from "@/assets/whitelogo.svg";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Apply for Loan", href: "/apply", icon: FilePlus2 },
  { name: "My Loans", href: "/loans", icon: Wallet },
  { name: "Notifications", href: "/notifications", icon: Bell },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Image src={whitelogo} alt="Aapka Credit" className="h-5 w-5 dark:invert-0 invert" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display text-sidebar-foreground">Aapka Credit</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== "/dashboard" && item.href !== "/apply");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                    "mr-3 h-5 w-5 shrink-0 transition-colors"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 space-y-1">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Settings
          </h3>
          <Link
            href="/profile"
            className={cn(
              pathname === "/profile"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
            )}
          >
            <Settings className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-sidebar-foreground transition-colors" aria-hidden="true" />
            Profile
          </Link>
          <form action={customerLogoutAction}>
            <button
              type="submit"
              className="w-full text-muted-foreground hover:bg-sidebar-accent/50 hover:text-destructive group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive transition-colors" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
