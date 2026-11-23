"use client";

import { ShieldCheck, Lock, Zap, Clock, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "RBI-Regulated NBFC Partners",
    text: "Loans sanctioned strictly through licensed NBFCs adhering to RBI digital lending guidelines.",
    badge: "Compliant",
  },
  {
    icon: Zap,
    title: "Paperless e-KYC",
    text: "Direct verification using DigiLocker Aadhaar e-KYC and NSDL PAN verification in under 2 minutes.",
    badge: "Digital",
  },
  {
    icon: Clock,
    title: "Transparent Prepayment Terms",
    text: "Repay your loan early with clear, upfront foreclosure terms as disclosed in your Key Fact Statement.",
    badge: "Transparent",
  },
  {
    icon: Lock,
    title: "Encrypted Data Security",
    text: "256-bit TLS encryption and strict access controls ensure your documents remain confidential and protected.",
    badge: "Secure",
  },
];

export function TrustPillars() {
  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Institutional standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Fair, transparent and compliant digital lending
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Compliant digital infrastructure designed for borrower protection and financial clarity.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.text}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>NBFC Verified Terms</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
