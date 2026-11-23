"use client";

import { TrendingUp, Wallet, CheckCircle2, Activity, Calculator } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";

function HealthRing({ value = 78 }: { value?: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={r}
          stroke="url(#hg)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
          <p className="text-[10px] font-medium text-slate-500">Score</p>
        </div>
      </div>
    </div>
  );
}

const offers = [
  {
    product: "Flexi Personal Loan",
    rate: "10.49%",
    emi: "₹8,885",
    tag: "Lowest Interest",
    tone: "text-emerald-700 bg-emerald-50 border border-emerald-200/60",
  },
  {
    product: "Instant Cash Advance",
    rate: "11.20%",
    emi: "₹4,250",
    tag: "5-Min Payout",
    tone: "text-blue-700 bg-blue-50 border border-blue-200/60",
  },
  {
    product: "MSME Growth Loan",
    rate: "12.50%",
    emi: "₹21,400",
    tag: "Zero Collateral",
    tone: "text-slate-700 bg-slate-100 border border-slate-200/80",
  },
];

export function DashboardShowcase() {
  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            Borrower experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            An Intuitive Dashboard Built For Total Control
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Track active sanctions, schedule AutoPay EMIs, monitor bureau health, and unlock pre-approved offers.
          </p>
        </div>

        <Reveal className="relative">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            {/* Window Chrome Header */}
            <div className="mb-4 flex items-center justify-between px-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="ml-2 text-xs font-mono text-slate-500">aapkacredit.com / borrower-portal</span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Live portal demo
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              
              {/* Credit Profile Widget */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-4 flex flex-col justify-between">
                <p className="text-xs font-medium text-slate-500 mb-2">Bureau health profile</p>
                <div className="flex items-center gap-4">
                  <HealthRing value={782} />
                  <div className="space-y-2">
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">CIBIL Status</p>
                      <p className="font-mono text-xl font-bold text-emerald-600 tabular-nums">782 <span className="text-xs font-medium text-slate-600">Excellent</span></p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Credit Utilization</p>
                      <p className="text-sm font-medium text-slate-800 font-mono tabular-nums">24% <span className="font-sans text-xs text-slate-500">(Optimal)</span></p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-2 text-[11px] text-slate-500 font-medium">
                  Verified by TransUnion CIBIL & Experian
                </div>
              </div>

              {/* Loan Offers Widget */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">Pre-approved sanctions</p>
                  <Wallet className="h-4 w-4 text-blue-600" />
                </div>
                <ul className="space-y-2.5">
                  {offers.map((o) => (
                    <li
                      key={o.product}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3 border border-slate-100"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{o.product}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${o.tone}`}>
                          {o.tag}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-medium">Monthly EMI</p>
                        <p className="text-xs font-mono font-bold text-slate-900 tabular-nums">{o.emi}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-500 font-medium">Interest</p>
                        <p className="text-xs font-mono font-bold text-emerald-600 tabular-nums">{o.rate}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instant Sanction Widget */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-slate-500">EMI scheduler</p>
                    <Calculator className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="font-mono text-2xl font-bold text-blue-600 tabular-nums">₹8,885 <span className="font-sans text-xs font-normal text-slate-500">/ mo</span></p>
                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Principal</span>
                      <span className="font-mono font-medium text-slate-800 tabular-nums">₹1,00,000</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tenure</span>
                      <span className="font-mono font-medium text-slate-800 tabular-nums">12 Months</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Interest</span>
                      <span className="font-mono font-medium text-emerald-600 tabular-nums">12.0% p.a.</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 mt-2">
                  <span className="text-[11px] font-medium text-emerald-700">AutoPay Active (HDFC Bank)</span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-7">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-slate-500">Recent disbursal milestones</p>
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <ul className="space-y-3 text-xs">
                  {[
                    { t: "Disbursal Credited via IMPS", s: "₹1,00,000 to A/C ending 4821 (UTR: IMPS918204)", time: "Just now", ok: true },
                    { t: "Digital Loan Agreement Signed", s: "Key Fact Statement accepted via Aadhaar OTP", time: "3 mins ago", ok: true },
                    { t: "DigiLocker e-KYC Verified", s: "UIDAI Aadhaar XML + Live Selfie Match (99.4%)", time: "5 mins ago", ok: true },
                  ].map((a) => (
                    <li key={a.t} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{a.t}</p>
                        <p className="text-slate-500 text-[11px]">{a.s}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 tabular-nums">{a.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trend Chart */}
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs lg:col-span-5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">On-time repayment record</p>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <svg viewBox="0 0 300 80" className="mt-2 h-16 w-full">
                  <defs>
                    <linearGradient id="ar" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,60 C40,50 60,55 90,40 C120,25 150,45 180,30 C210,20 240,25 300,10 L300,80 L0,80 Z"
                    fill="url(#ar)"
                  />
                  <path
                    d="M0,60 C40,50 60,55 90,40 C120,25 150,45 180,30 C210,20 240,25 300,10"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                  />
                </svg>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                  <span>May</span>
                  <span>Jul</span>
                  <span>Sep</span>
                  <span>Nov</span>
                  <span>Jan</span>
                  <span>Mar</span>
                </div>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
