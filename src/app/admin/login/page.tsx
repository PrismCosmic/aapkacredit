"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Lock, User } from "lucide-react";
import Image from "next/image";
import whitelogo from "@/assets/whitelogo.svg";

const initialState = {
  error: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card rounded-2xl p-7 shadow-xs border border-border">
          <div className="flex flex-col items-center mb-6">
            <Image src={whitelogo} alt="Aapka Credit" className="h-10 w-auto mb-3 dark:invert-0 invert" priority />
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Sign in to manage platform operations</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="off"
                  className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-xs"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-xs"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg p-2.5 flex items-center justify-center">
                {state.error}
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-primary to-electric hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
