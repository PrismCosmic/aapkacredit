"use client";

import Link from "next/link";
import { UserCheck, FileCheck2, CheckCircle, Banknote, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Quick Registration",
    time: "60 seconds",
    desc: "Enter your mobile number and verify via OTP. Provide basic employment and PAN details.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "Digital KYC",
    time: "2 minutes",
    desc: "Instant paperless verification using DigiLocker Aadhaar XML and live selfie verification.",
    icon: FileCheck2,
  },
  {
    step: "03",
    title: "Instant Sanction Limit",
    time: "Instant",
    desc: "Automated underwriting verifies eligibility and calculates your approved loan sanction.",
    icon: CheckCircle,
  },
  {
    step: "04",
    title: "Direct Bank Transfer",
    time: "IMPS Credit",
    desc: "Review loan terms (KFS), verify bank account via penny-drop, and receive funds via 24x7 IMPS.",
    icon: Banknote,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 bg-slate-50/70 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Application process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            From application to bank credit in 5 minutes
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No physical branch visits or paper document submission.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xl font-bold text-slate-300 font-mono">
                      {s.step}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {s.time}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4 text-blue-600">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Step {idx + 1} of 4</span>
                  <span className="text-emerald-700 font-medium">100% Online</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Representative Example Box (KreditBee & Moneyview Regulatory Compliance) ── */}
        <div className="mt-16 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                  RBI Fair Practice Disclosure
                </span>
                <span className="text-xs font-medium text-slate-500">Representative Loan Calculation</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mt-2">
                Transparent Pricing Guarantee — Zero Hidden Surprises
              </h3>
            </div>
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl transition shadow-xs self-start md:self-auto"
            >
              <span>Get Your Sanction Letter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Key Metric Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Principal Loan</span>
              <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">₹1,00,000</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Tenure</span>
              <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">12 Months</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Interest Rate</span>
              <span className="text-base font-semibold text-emerald-700 font-mono tabular-nums">12% p.a.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Monthly EMI</span>
              <span className="text-base font-semibold text-blue-600 font-mono tabular-nums">₹8,885</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Total Interest</span>
              <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">₹6,619</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Total Repayment</span>
              <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">₹1,06,619</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-mono tabular-nums">
            *Representative Example: For a loan of ₹1,00,000 borrowed for 12 months at an annual interest rate (APR) of 12%, processing fee of 2% (₹2,000 + 18% GST = ₹2,360), net disbursed amount is ₹97,640. Monthly EMI will be ₹8,885. Total interest payable is ₹6,619. Total amount repayable is ₹1,06,619. Annual Percentage Rate (APR) comes to 14.8%.
          </p>
        </div>

      </div>
    </section>
  );
}
