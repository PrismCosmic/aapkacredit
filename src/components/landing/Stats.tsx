"use client";

import { CountUp } from "@/components/fx/CountUp";
import { Users, IndianRupee, Zap, ThumbsUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 50,
    suffix: " Lakh+",
    label: "Registered Users",
    sub: "Across 2,400+ pin codes in India",
    color: "text-blue-600 bg-blue-50 border border-blue-100",
  },
  {
    icon: IndianRupee,
    value: 2500,
    suffix: "+ Cr",
    label: "Total Disbursed",
    sub: "Directly into verified bank accounts",
    color: "text-emerald-700 bg-emerald-50 border border-emerald-100",
  },
  {
    icon: Zap,
    value: 2,
    suffix: " Mins",
    label: "Sanction Decision",
    sub: "Powered by instant bureau analytics",
    color: "text-blue-600 bg-blue-50 border border-blue-100",
  },
  {
    icon: ThumbsUp,
    value: 99.4,
    suffix: "%",
    label: "Customer Satisfaction",
    sub: "Verified post-disbursement feedback",
    color: "text-slate-700 bg-slate-100 border border-slate-200",
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center justify-between shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-1 tabular-nums">
                  <CountUp to={s.value} suffix={s.suffix} />
                </div>
                <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
