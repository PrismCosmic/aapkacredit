"use client";

import { ShieldCheck, Building, CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";

const partners = [
  {
    name: "Vivriti Capital Limited",
    type: "RBI Regulated NBFC-ND-SI",
    regNo: "N-07.00842",
    tag: "Principal Lending Partner",
    badge: "RBI Registered",
  },
  {
    name: "Northern Arc Capital",
    type: "RBI Regulated Systemically Important NBFC",
    regNo: "N-07.00803",
    tag: "Retail & MSME Co-Lender",
    badge: "RBI Registered",
  },
  {
    name: "DMI Finance Private Limited",
    type: "RBI Regulated Digital Lending NBFC",
    regNo: "B-14.01525",
    tag: "Consumer Credit Partner",
    badge: "RBI Registered",
  },
  {
    name: "InCred Financial Services",
    type: "RBI Registered NBFC",
    regNo: "B-13.01892",
    tag: "Personal & Education Loans",
    badge: "RBI Registered",
  },
];

const ecosystemNetworks = [
  { name: "DigiLocker", desc: "UIDAI Paperless e-KYC" },
  { name: "NSDL / Protean", desc: "Instant PAN Verification" },
  { name: "NPCI e-Mandate", desc: "Automated UPI & e-NACH AutoPay" },
  { name: "TransUnion CIBIL", desc: "Real-Time Bureau Scoring" },
  { name: "Experian Credit", desc: "Alternative Risk Analytics" },
  { name: "RazorpayX Banking", desc: "Instant 24x7 IMPS Payouts" },
];

export function LendingPartners() {
  return (
    <section className="py-20 bg-slate-50/70 border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Regulated lending ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Regulated Lending Partners & Technology Network
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Aapka Credit partners with premier RBI-registered financial institutions and national payments infrastructure to ensure fair, transparent, and secure digital lending.
          </p>
        </div>

        {/* 4 NBFC Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {partners.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-600 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    {p.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{p.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{p.type}</p>
                <p className="text-[11px] font-mono text-blue-600 font-medium mt-1">CIN / Reg: {p.regNo}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">{p.tag}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure & Banking APIs Strip */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Authorized National Digital Infrastructure Integrations
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Connecting directly with Government of India and RBI payment gateways.
              </p>
            </div>
            <Link
              href="/compliance"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <span>View full Fair Practices Code</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {ecosystemNetworks.map((net) => (
              <div key={net.name} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                <p className="text-xs font-bold text-slate-900">{net.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{net.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
