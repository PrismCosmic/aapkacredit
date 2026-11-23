"use client";

import { ShieldCheck, KeyRound, Server, FileLock, Building2, CheckCircle2, Lock, Cpu, Globe, Check } from "lucide-react";

const securityFeatures = [
  {
    icon: KeyRound,
    title: "256-Bit Bank-Grade Encryption",
    text: "All customer data in transit and at rest is protected with AES-256 GCM encryption, matching tier-1 global banking standards.",
    badge: "AES-256 GCM",
  },
  {
    icon: Server,
    title: "Data Localized in India",
    text: "100% of user data and loan documents are hosted on secure Indian cloud data centers adhering strictly to RBI data localization norms.",
    badge: "RBI Compliant",
  },
  {
    icon: ShieldCheck,
    title: "RBI NBFC Compliant Architecture",
    text: "Direct integration with licensed RBI-registered NBFCs ensuring strict adherence to the Digital Lending Guidelines (DLG).",
    badge: "RBI Regulated",
  },
  {
    icon: FileLock,
    title: "DigiLocker & UIDAI Approved",
    text: "Paperless identity verification powered by official government DigiLocker XML e-KYC and NSDL PAN verification APIs.",
    badge: "Govt of India",
  },
  {
    icon: Building2,
    title: "Zero Data Sharing Policy",
    text: "We never sell or share your phone number, contacts, or documents with third-party telemarketers. Your privacy is inviolable.",
    badge: "100% Private",
  },
];

const telemetryMetrics = [
  { label: "Encryption", val: "AES-256 + TLS 1.3" },
  { label: "Data Residency", val: "AWS / GCP India" },
  { label: "KYC Engine", val: "DigiLocker XML" },
  { label: "Compliance", val: "RBI DLG 2023" },
];

export function Security() {
  return (
    <section id="security" className="py-24 bg-slate-50/80 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 mb-3">
            <Lock className="w-3.5 h-3.5 text-slate-500" /> Institutional safety & compliance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bank-Grade Security Built For Your Peace Of Mind
          </h2>
          <p className="mt-3 text-base text-slate-600">
            We hold ourselves to the highest standards of financial data protection, regulatory oversight, and customer privacy.
          </p>
        </div>

        {/* Big Security Banner Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Big Shield & Telemetry Monitor */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200 text-center relative">
              
              {/* Live Operational Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-medium mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Security Engine: 100% Operational</span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs mb-5">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">100% Safe & Encrypted</h3>
              <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
                Licensed under RBI NBFC digital lending framework with 24x7 threat monitoring, continuous vulnerability scanning, and isolated storage.
              </p>

              {/* Security Telemetry Stats Grid */}
              <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-slate-200 text-left">
                {telemetryMetrics.map((m) => (
                  <div key={m.label} className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-medium">{m.label}</span>
                    <span className="text-xs font-mono font-medium text-slate-800 block truncate">{m.val}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badges Chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="text-[11px] font-medium px-2.5 py-1 bg-white text-slate-700 rounded-md border border-slate-200 shadow-2xs">
                  ISO 27001 Certified
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 bg-white text-slate-700 rounded-md border border-slate-200 shadow-2xs">
                  DigiLocker Partner
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 bg-white text-slate-700 rounded-md border border-slate-200 shadow-2xs">
                  PCI-DSS Aligned
                </span>
              </div>
            </div>

            {/* Right Security Checklist */}
            <div className="lg:col-span-7 space-y-4">
              {securityFeatures.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="flex items-start gap-4 p-3.5 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-bold text-slate-900">{feat.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          {feat.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">{feat.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

