"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge, CheckCircle2, ArrowRight, Lock, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

export function CreditScoreCheck() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [simulatedScore, setSimulatedScore] = useState<number>(782);

  const getScoreDetails = (score: number) => {
    if (score >= 750) {
      return {
        label: "Excellent",
        color: "#10B981", // Emerald
        textColor: "text-emerald-400",
        badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        limit: "Up to ₹5,00,000",
        rate: "10.49% p.a.",
        approvalChance: "High Instant Eligibility",
      };
    } else if (score >= 700) {
      return {
        label: "Good",
        color: "#3B82F6", // Blue
        textColor: "text-blue-400",
        badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        limit: "Up to ₹3,50,000",
        rate: "11.99% p.a.",
        approvalChance: "Fast Sanction Eligible",
      };
    } else if (score >= 650) {
      return {
        label: "Fair",
        color: "#F59E0B", // Amber
        textColor: "text-amber-400",
        badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        limit: "Up to ₹2,00,000",
        rate: "13.50% p.a.",
        approvalChance: "Standard Sanction Eligible",
      };
    } else {
      return {
        label: "Starter",
        color: "#EF4444", // Rose / Red
        textColor: "text-rose-400",
        badgeBg: "bg-rose-500/20 text-rose-400 border-rose-500/30",
        limit: "Up to ₹75,000",
        rate: "15.00% p.a.",
        approvalChance: "Eligible with Income Proof",
      };
    }
  };

  const details = getScoreDetails(simulatedScore);

  // SVG Gauge calculations (circumference for r=40 is ~251.3)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Normalized score 300 to 900 (range 600)
  const normalized = Math.max(0, Math.min(1, (simulatedScore - 300) / 600));
  const strokeDashoffset = circumference - normalized * circumference;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length !== 10) return;
    router.push(`/apply?mobile=${encodeURIComponent(cleaned)}&score=${simulatedScore}`);
  };

  const scoreTiers = [
    { label: "Starter", score: 620 },
    { label: "Fair", score: 680 },
    { label: "Good", score: 735 },
    { label: "Excellent", score: 785 },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50/60 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Gauge className="w-3.5 h-3.5" /> Soft Eligibility & Bureau Estimator
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Estimate Your Credit Eligibility With Zero Score Impact
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Know your indicative sanction tier before applying. Soft eligibility simulation with zero credit score deduction; official bureau underwriting and fee disclosures apply in the customer portal when you submit a loan application.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Upfront Key Fact Statement (KFS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero score deduction on soft check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>TransUnion CIBIL & Experian aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>RBI-regulated NBFC partner offers</span>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleCheck} className="pt-3 max-w-md">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white placeholder:text-slate-400 text-sm border border-white/20 focus:outline-hidden focus:bg-white/15 focus:border-emerald-400 font-semibold transition"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition shadow-md shadow-emerald-500/25 active:scale-98 inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Check Score</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Your information is strictly encrypted with bank-grade 256-bit SSL</span>
                </p>
              </form>
            </div>

            {/* Right Bureau Score Gauge Visual (Interactive Simulator) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center shadow-lg">
              
              <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300 pb-3 border-b border-white/10 mb-4">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Score Simulator
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${details.badgeBg}`}>
                  {details.label}
                </span>
              </div>

              {/* Gauge Arc */}
              <div className="relative w-44 h-44 flex items-center justify-center mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke={details.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white tracking-tight">{simulatedScore}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${details.textColor}`}>
                    {details.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Bureau Score</span>
                </div>
              </div>

              {/* Interactive Score Slider */}
              <div className="w-full space-y-2 mb-4">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>300 (Poor)</span>
                  <span className="text-white font-bold">Simulate: {simulatedScore}</span>
                  <span>900 (Top)</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={5}
                  value={simulatedScore}
                  onChange={(e) => setSimulatedScore(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                
                {/* Score Tiers Chips */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {scoreTiers.map((tier) => (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => setSimulatedScore(tier.score)}
                      className={`text-[10px] py-1 rounded-md font-bold transition ${
                        Math.abs(simulatedScore - tier.score) < 30
                          ? "bg-white text-slate-900 shadow-xs"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Instant Sanction Estimation */}
              <div className="w-full bg-white/10 rounded-2xl p-3 border border-white/10 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Sanction Limit:</span>
                  <span className="font-extrabold text-white text-sm">{details.limit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Estimated Rate:</span>
                  <span className="font-extrabold text-emerald-400">{details.rate}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-white/10 text-[11px]">
                  <span className="text-slate-400">Eligibility Status:</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {details.approvalChance}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

