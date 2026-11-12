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
    <div className="min-h-screen flex items-center justify-center bg-background noise p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="glass-strong rounded-3xl p-8 shadow-elegant border-foreground/10">
          <div className="flex flex-col items-center mb-8">
            <Image src={whitelogo} alt="Apka Credit" className="h-12 w-auto mb-4 dark:invert-0 invert" priority />
            <h1 className="text-2xl font-display font-semibold text-foreground tracking-tight">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to manage Aapka Credit</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="off"
                  className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3 flex items-center justify-center">
                {state.error}
              </div>
            )}

            <div className="pt-2">
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
