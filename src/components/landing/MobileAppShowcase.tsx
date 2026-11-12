"use client";

import { useState } from "react";
import { Smartphone, Star, QrCode, Download, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function MobileAppShowcase() {
  const [mobileForLink, setMobileForLink] = useState("");
  const [sendingLink, setSendingLink] = useState(false);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = mobileForLink.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setSendingLink(true);
    try {
      const res = await fetch("/api/public/app-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: cleaned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        toast.error(data?.error || "Unable to send app link right now.");
        return;
      }
      toast.success(data.message || `Download link sent to +91 ${cleaned}! Check your SMS.`);
      setMobileForLink("");
    } catch {
      toast.error("Network error while requesting app download link.");
    } finally {
      setSendingLink(false);
    }
  };

  return (
    <section className="py-24 bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-slate-50/80 rounded-3xl p-8 sm:p-14 border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: App Features & Links */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                <Smartphone className="w-3.5 h-3.5" /> Mobile App Experience
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Manage Sanctions, EMIs & Credit Health On The Go
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Download the official Aapka Credit app for faster biometric login, instant paperless KYC, and 1-tap UPI AutoPay EMI repayments.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant 5-Minute IMPS Payout</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Tap UPI AutoPay Setup</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Digital NOC on Closure</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24x7 In-App Chat Support</span>
                </div>
              </div>

              {/* Ratings proof */}
              <div className="pt-3 flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">4.8★</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">50 Lakh+ Downloads</span>
                <span className="text-xs text-slate-500 font-medium">#1 Lending App</span>
              </div>

              {/* SMS App Link Form */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Get App Download Link via SMS
                </p>
                <form onSubmit={handleSendLink} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-1 bg-white rounded-xl flex items-center pl-3 border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 mr-2">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter mobile number"
                      value={mobileForLink}
                      onChange={(e) => setMobileForLink(e.target.value.replace(/\D/g, ""))}
                      className="w-full text-xs text-slate-900 py-3 font-semibold focus:outline-hidden"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingLink}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition shadow-xs whitespace-nowrap"
                  >
                    {sendingLink ? "Sending..." : "Send App Link"}
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Phone Mockup Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-72 bg-slate-900 rounded-[40px] p-3.5 shadow-2xl border-4 border-slate-800 relative">
                {/* Speaker pill */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

                {/* Inside Screen */}
                <div className="bg-white rounded-[32px] p-5 space-y-4 text-slate-900 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs font-extrabold text-blue-600">AapkaCredit</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Approved
                    </span>
                  </div>

                  <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanction Available</span>
                    <span className="text-2xl font-black text-slate-900">₹3,50,000</span>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Ready for instant transfer</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly EMI</span>
                      <span className="font-bold text-slate-900">₹11,400</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tenure</span>
                      <span className="font-bold text-slate-900">36 Months</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Verified Bank</span>
                      <span className="font-bold text-slate-900">HDFC •••• 4821</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>Disburse Now via IMPS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
