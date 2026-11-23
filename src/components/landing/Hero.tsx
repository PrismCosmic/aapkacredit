"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Zap,
  ArrowRight,
  Star,
  Lock,
  ChevronRight,
  ShieldCheck,
  Clock,
  CreditCard,
  Briefcase,
  HeartHandshake,
  Stethoscope,
  Home,
  GraduationCap,
  Calculator,
} from "lucide-react";

const liveDisbursals = [
  { name: "Rahul M.", city: "Bengaluru", amount: "₹1,50,000", time: "2m ago" },
  { name: "Ananya S.", city: "Jaipur", amount: "₹75,000", time: "3m ago" },
  { name: "Vikram P.", city: "Mumbai", amount: "₹3,00,000", time: "5m ago" },
  { name: "Deepak K.", city: "Hyderabad", amount: "₹45,000", time: "8m ago" },
  { name: "Sneha G.", city: "Delhi NCR", amount: "₹2,20,000", time: "11m ago" },
  { name: "Amit B.", city: "Pune", amount: "₹4,50,000", time: "14m ago" },
];

const loanPurposes = [
  { label: "Personal", amount: 300000, tenure: 24, icon: CreditCard },
  { label: "Business", amount: 1000000, tenure: 36, icon: Briefcase },
  { label: "Wedding", amount: 500000, tenure: 36, icon: HeartHandshake },
  { label: "Medical", amount: 200000, tenure: 18, icon: Stethoscope },
  { label: "Home Reno", amount: 400000, tenure: 36, icon: Home },
  { label: "Education", amount: 600000, tenure: 48, icon: GraduationCap },
];

export function Hero() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState("");
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [selectedPurpose, setSelectedPurpose] = useState<string>("Personal");
  const [tickerIdx, setTickerIdx] = useState(0);
  const interestRate = 10.49; // 10.49% p.a.

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % liveDisbursals.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalPayable = emi * tenureMonths;
  const totalInterest = Math.max(0, totalPayable - loanAmount);
  const principalPercent = Math.round((loanAmount / totalPayable) * 100) || 75;
  const interestPercent = 100 - principalPercent;

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      router.push(`/apply?mobile=${encodeURIComponent(mobileNumber)}&amount=${loanAmount}&tenure=${tenureMonths}`);
    } else {
      router.push(`/apply?amount=${loanAmount}&tenure=${tenureMonths}`);
    }
  };

  const handlePurposeSelect = (purpose: (typeof loanPurposes)[0]) => {
    setSelectedPurpose(purpose.label);
    setLoanAmount(purpose.amount);
    setTenureMonths(purpose.tenure);
  };

  const amountPresets = [50000, 100000, 300000, 500000, 1000000, 2500000];
  const tenurePresets = [6, 12, 24, 36, 48, 60];

  return (
    <section className="relative overflow-hidden bg-slate-50/50 pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Value Proposition & High Trust ── */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Micro Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-200">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                <span>5-Minute Disbursal • RBI Regulated</span>
              </div>

              {/* Dynamic Live Disbursal Ticker */}
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200 transition-colors">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Disbursed <strong className="font-semibold text-slate-900 tabular-nums font-mono">{liveDisbursals[tickerIdx].amount}</strong> to {liveDisbursals[tickerIdx].name} ({liveDisbursals[tickerIdx].city}) • {liveDisbursals[tickerIdx].time}
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
              Instant digital loans up to{" "}
              <span className="text-blue-600 tabular-nums font-mono">
                ₹50,00,000
              </span>{" "}
              in 5 minutes
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              India&apos;s direct digital lending platform. Paperless KYC via DigiLocker, transparent interest rates starting from{" "}
              <strong className="text-slate-900 font-semibold tabular-nums font-mono">10.49% p.a.</strong>, and instant IMPS transfer to your bank account.
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% digital via DigiLocker & Aadhaar</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Instant bank disbursal via IMPS (24x7)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero prepayment & foreclosure penalties</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Starter CIBIL score (600+) welcomed</span>
              </div>
            </div>

            {/* Instant Mobile Sanction Form */}
            <div className="pt-3 max-w-lg">
              <form onSubmit={handleMobileSubmit} className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white rounded-xl shadow-xs border border-slate-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition">
                <div className="relative flex-1 flex items-center pl-3">
                  <span className="text-sm font-medium text-slate-400 mr-2 font-mono">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-2.5 font-medium font-mono"
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
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5 pl-1">
                <Lock className="h-3 w-3 text-slate-400" />
                <span>Zero spam • 256-bit bank encryption • No impact on CIBIL score</span>
              </p>
            </div>

            {/* Social Proof Strip with User Trust */}
            <div className="pt-5 border-t border-slate-200/80 flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">4.9 / 5 Rating</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                <strong className="text-slate-900 font-bold">50 Lakh+</strong> Happy Customers
              </div>
              <div className="text-xs text-slate-600 font-medium">
                <strong className="text-slate-900 font-bold">₹2,500+ Cr</strong> Disbursed
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive Loan EMI Calculator (Elevated Fintech) ── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200">
              
              {/* Header & Purpose Pills */}
              <div className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-blue-600" /> Loan EMI Calculator
                    </h2>
                    <p className="text-xs text-slate-500">Instant monthly instalment estimate</p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 font-mono">
                    From 10.49% p.a.
                  </span>
                </div>

                {/* Purpose Pills Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1 pb-0.5">
                  {loanPurposes.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handlePurposeSelect(p)}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium shrink-0 transition flex items-center gap-1.5 ${
                          selectedPurpose === p.label
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 1: Loan Amount */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-500">Loan amount</label>
                  <span className="text-base font-semibold text-blue-600 font-mono tabular-nums">₹{loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {amountPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLoanAmount(preset)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition ${
                        loanAmount === preset
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      ₹{preset >= 100000 ? `${preset / 100000}L` : `${preset / 1000}K`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-slate-500">Tenure</label>
                  <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">{tenureMonths} months</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={60}
                  step={1}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                {/* Tenure Chips */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {tenurePresets.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTenureMonths(t)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md border transition ${
                        tenureMonths === t
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {t}M
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Box with Visual Breakdown */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Estimated monthly EMI</span>
                  <span className="text-2xl font-bold text-blue-700 font-mono tabular-nums">₹{emi.toLocaleString("en-IN")}<span className="text-xs text-slate-500 font-normal"> / mo</span></span>
                </div>

                {/* Visual Principal vs Interest Progress Bar */}
                <div className="my-2.5">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${principalPercent}%` }}
                      className="bg-emerald-600 h-full transition-all duration-200"
                      title={`Principal: ${principalPercent}%`}
                    />
                    <div
                      style={{ width: `${interestPercent}%` }}
                      className="bg-blue-600 h-full transition-all duration-200"
                      title={`Interest: ${interestPercent}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      Principal: {principalPercent}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      Interest: {interestPercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total interest</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">₹{totalInterest.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Total payable</span>
                    <span className="font-semibold text-slate-800 font-mono tabular-nums">₹{totalPayable.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <Link
                  href={`/apply?amount=${loanAmount}&tenure=${tenureMonths}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition active:scale-[0.99]"
                >
                  <span>Apply for ₹{loanAmount.toLocaleString("en-IN")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" /> Disbursal in 5 mins
                  </span>
                  <span>•</span>
                  <span>100% paperless e-KYC</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

