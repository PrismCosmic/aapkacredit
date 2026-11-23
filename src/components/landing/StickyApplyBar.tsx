"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";

export function StickyApplyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (approx 450px)
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-white border-t border-slate-200 shadow-md transition-all duration-200">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Information */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-9 h-9 rounded-lg bg-blue-50 text-blue-600 items-center justify-center shrink-0 border border-blue-100">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-slate-900">
                Instant Cash in Bank in 5 Minutes
              </span>
              <span className="hidden md:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                RBI Regulated
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-mono tabular-nums">
              Sanctions up to ₹50,00,000 • 100% digital KYC • From 10.49% p.a.
            </p>
          </div>
        </div>

        {/* Right CTA Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/calculator"
            className="hidden lg:inline-flex px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            Calculate EMI
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition shadow-xs whitespace-nowrap"
          >
            <span>Apply in 2 mins</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
