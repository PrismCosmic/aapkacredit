"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Lock } from "lucide-react";

export function FinalCta() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length >= 10) {
      router.push(`/apply?mobile=${encodeURIComponent(mobile)}`);
    } else {
      router.push("/apply");
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-14 sm:px-14 sm:py-16 text-white border border-slate-800 text-center">
          
          <div className="relative max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Digital lending infrastructure
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Ready to verify your credit eligibility?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
              Check your sanction limit in under 60 seconds with zero credit score impact. Transparent rates with RBI-regulated NBFC partners.
            </p>

            {/* Quick Action Form */}
            <form onSubmit={handleSubmit} className="pt-2 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 bg-white rounded-lg flex items-center pl-3 border border-slate-300">
                <span className="text-sm font-medium text-slate-400 mr-2 font-mono">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 py-2.5 font-medium font-mono focus:outline-hidden"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition active:scale-[0.99]"
              >
                <span>Check Sanction</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> RBI-regulated NBFCs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> 256-bit bank encryption
              </span>
              <span>•</span>
              <span>Zero CIBIL score impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
