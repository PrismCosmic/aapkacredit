"use client";

import { Check, X, Zap, Shield, Smartphone, HeartHandshake, RefreshCw, Clock } from "lucide-react";

const comparisons = [
  {
    feature: "Approval & Disbursal Speed",
    aapka: "5 to 10 Minutes via automated instant sanction",
    banks: "7 to 15 Days with multiple branch visits",
  },
  {
    feature: "Documentation",
    aapka: "100% Paperless DigiLocker e-KYC (Aadhaar & PAN)",
    banks: "Heavy physical dossiers, salary slips, photo proofs",
  },
  {
    feature: "Credit Score Requirement",
    aapka: "Flexible (Starter profiles 600+ welcomed)",
    banks: "Strict cutoff (750+ CIBIL score mandatory)",
  },
  {
    feature: "Prepayment & Foreclosure Charges",
    aapka: "Zero charges anytime after 1st EMI",
    banks: "2% to 5% penal foreclosure fee",
  },
  {
    feature: "Disbursal Channel",
    aapka: "Instant 24x7 IMPS directly to verified bank account",
    banks: "Delayed NEFT / Cheque clearing during working hours",
  },
];

const capabilities = [
  {
    icon: Zap,
    title: "Real-Time Eligibility Engine",
    desc: "Proprietary algorithmic underwriting computes instant sanction limits without affecting your credit score.",
  },
  {
    icon: Clock,
    title: "Instant 24x7 Disbursal",
    desc: "Once approved, funds are transferred straight to your bank account via IMPS within minutes — day or night.",
  },
  {
    icon: Shield,
    title: "100% RBI NBFC Compliant",
    desc: "Every loan adheres strictly to RBI digital lending guidelines and fair practice codes for borrower safety.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Experience",
    desc: "Apply, track repayments, download NOCs, and request top-up loans conveniently from your smartphone.",
  },
  {
    icon: RefreshCw,
    title: "AutoPay via UPI & e-NACH",
    desc: "Hassle-free automated monthly instalments via NPCI e-Mandate or Google Pay, PhonePe, Paytm UPI.",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Grievance Support",
    desc: "Friendly, responsive support team and dedicated nodal grievance officer to assist you at every step.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            Service comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Why borrowers choose Aapka Credit
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Compare modern digital lending with traditional branch banking procedures.
          </p>
        </div>

        {/* ── Side-by-Side Comparison Matrix ── */}
        <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs mb-16 overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Digital Lending vs Traditional Branch Banking</h3>
              <p className="text-xs text-slate-500">Comparison of turnaround time, documentation, and flexibility</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saves avg. ₹18,500 & 12 days</span>
            </div>
          </div>

          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-xs font-medium text-slate-500 w-2/5">
                  Lending feature
                </th>
                <th className="pb-3 text-xs font-semibold text-blue-700 w-3/10 bg-blue-50/80 px-4 py-2 rounded-t-lg">
                  <div className="flex items-center gap-1.5">
                    <span>Aapka Credit</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-600 text-white">
                      Digital
                    </span>
                  </div>
                </th>
                <th className="pb-3 text-xs font-medium text-slate-500 w-3/10 pl-4">
                  Traditional branch banks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {comparisons.map((row) => (
                <tr key={row.feature} className="hover:bg-white/60 transition-colors">
                  <td className="py-3.5 text-xs font-semibold text-slate-800 pr-4">{row.feature}</td>
                  <td className="py-3.5 text-xs text-slate-800 pr-4 bg-blue-50/40 px-4 border-x border-blue-100">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{row.aapka}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-slate-500 pl-4">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{row.banks}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 6 Capabilities Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{c.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
