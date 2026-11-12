"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Landmark,
  IndianRupee,
  Loader2,
  Sparkles,
  Upload,
  Check,
  Zap,
  Building,
  Briefcase,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

const MIN_AMOUNT = 10000;
const MAX_AMOUNT = 500000;

const LOAN_PURPOSES = [
  "Personal Needs",
  "Medical Emergency",
  "Debt Consolidation",
  "Home Renovation",
  "Business Growth",
  "Education",
  "Wedding / Family",
];

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(150000);
  const [tenure, setTenure] = useState(12);
  const [scoreHint, setScoreHint] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Verification Flags
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isPanVerified, setIsPanVerified] = useState(false);
  const [isVerifyingBank, setIsVerifyingBank] = useState(false);
  const [isBankVerified, setIsBankVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    pan: "",
    aadhaar: "",
    monthlyIncome: "",
    employmentType: "Salaried",
    purpose: "Personal Needs",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [docs, setDocs] = useState<{
    panFile: File | null;
    bankFile: File | null;
  }>({
    panFile: null,
    bankFile: null,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const score = params.get("score");
    if (score && /^\d+$/.test(score)) {
      setScoreHint(score);
    }

    fetch("/api/portal/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const u = json?.data;
        if (!u) return;
        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || u.full_name || "",
          pan: prev.pan || u.pan_number || "",
          aadhaar: prev.aadhaar || u.aadhar_number || "",
        }));
        if (u.pan_number) setIsPanVerified(true);
      })
      .catch(() => {});
  }, []);

  const monthlyRate = 13.5 / 12 / 100;
  const emi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
  );

  const handleVerifyPan = async () => {
    const cleanPan = formData.pan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan)) {
      toast.error("Please enter a valid 10-character PAN number (e.g. ABCDE1234F)");
      return;
    }
    setIsVerifyingPan(true);
    try {
      const res = await fetch("/api/portal/onboarding/kyc/pan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan_number: cleanPan }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        setIsPanVerified(true);
        if (json.data?.full_name && !formData.fullName) {
          setFormData((prev) => ({ ...prev, fullName: json.data.full_name }));
        }
        toast.success(`PAN Verified: ${json.data?.full_name || cleanPan}`);
      } else {
        toast.error(json.message || json.detail || "PAN verification failed. Please check your PAN number.");
      }
    } catch {
      toast.error("Unable to reach PAN verification service. Please retry.");
    } finally {
      setIsVerifyingPan(false);
    }
  };

  const handleVerifyBank = async () => {
    const cleanAcc = formData.accountNumber.replace(/\D/g, "");
    const cleanIfsc = formData.ifsc.trim().toUpperCase();
    if (cleanAcc.length < 9 || cleanAcc.length > 18) {
      toast.error("Please enter a valid bank account number (9–18 digits)");
      return;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      toast.error("Please enter a valid 11-character IFSC code (e.g. HDFC0001234)");
      return;
    }
    setIsVerifyingBank(true);
    try {
      const res = await fetch("/api/portal/financials/bank/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: cleanAcc,
          ifsc_code: cleanIfsc,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        setIsBankVerified(true);
        toast.success("Bank Account Verified via ₹1 Penny Drop!");
      } else {
        toast.error(json.message || json.detail || "Bank account verification failed. Please check account number & IFSC.");
      }
    } catch {
      toast.error("Unable to reach bank verification service. Please retry.");
    } finally {
      setIsVerifyingBank(false);
    }
  };

  const validateStep2 = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      toast.error("Please enter your full legal name as per PAN.");
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan.trim().toUpperCase())) {
      toast.error("Please enter a valid 10-character PAN (e.g., ABCDE1234F).");
      return false;
    }
    const cleanAadhaar = formData.aadhaar.replace(/\D/g, "");
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      toast.error("Please enter a valid 12-digit Aadhaar number.");
      return false;
    }
    if (!formData.bankName.trim()) {
      toast.error("Please enter your Bank Name.");
      return false;
    }
    const cleanAcc = formData.accountNumber.replace(/\D/g, "");
    if (cleanAcc.length < 9 || cleanAcc.length > 18) {
      toast.error("Please enter a valid bank account number (9–18 digits).");
      return false;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc.trim().toUpperCase())) {
      toast.error("Please enter a valid 11-character IFSC code (e.g., HDFC0001234).");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const applyRes = await fetch("/api/portal/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_amount: amount,
          name: formData.fullName.trim(),
          pan_number: formData.pan.trim().toUpperCase(),
          aadhaar_number: formData.aadhaar.replace(/\D/g, ""),
          purpose: formData.purpose,
        }),
      });
      const applyJson = await applyRes.json().catch(() => ({}));
      if (!applyRes.ok || applyJson?.success === false || !applyJson?.data?.loan_id) {
        throw new Error(applyJson?.message || "Failed to initiate loan application.");
      }

      const loanId: string = applyJson.data.loan_id;

      const kycRes = await fetch(`/api/portal/loans/${encodeURIComponent(loanId)}/kyc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaar_number: formData.aadhaar.replace(/\D/g, ""),
          pan_number: formData.pan.trim().toUpperCase(),
          bank_account: formData.accountNumber.replace(/\D/g, ""),
          ifsc_code: formData.ifsc.trim().toUpperCase(),
        }),
      });
      const kycJson = await kycRes.json().catch(() => ({}));
      if (!kycRes.ok || kycJson?.success === false) {
        toast.warning(
          kycJson?.message || "Application created, but KYC verification requires review."
        );
      }

      if (docs.panFile) {
        const fd = new FormData();
        fd.append("file", docs.panFile);
        await fetch("/api/portal/documents/PAN", { method: "POST", body: fd }).catch(() => {});
      }
      if (docs.bankFile) {
        const fd = new FormData();
        fd.append("file", docs.bankFile);
        await fetch("/api/portal/documents/BANK_STATEMENT", {
          method: "POST",
          body: fd,
        }).catch(() => {});
      }

      toast.success("Application submitted for underwriting!");
      router.push(`/apply/status?loan_id=${encodeURIComponent(loanId)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit application.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Instant Personal Loan Application</h1>
        <p className="text-muted-foreground">
          Apply in minutes with 100% paperless e-KYC and automated RBI-compliant underwriting.
        </p>
        {scoreHint && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Credit Score Detected: {scoreHint} — Fast-Track Assessment Active
          </div>
        )}
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-center max-w-2xl mx-auto px-4">
        {[
          { num: 1, title: "Loan Offer", icon: IndianRupee },
          { num: 2, title: "KYC & Bank", icon: Landmark },
          { num: 3, title: "Review & Submit", icon: FileText },
        ].map((item, idx) => (
          <div key={item.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > item.num
                    ? "bg-emerald-500 text-white"
                    : step === item.num
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {step > item.num ? <CheckCircle2 className="w-5 h-5" /> : <item.icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs font-semibold ${
                  step >= item.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.title}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`h-0.5 flex-1 mx-4 rounded-full transition-colors ${
                  step > item.num ? "bg-emerald-500" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: Loan Requirement & Calculator */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-bold">How much funding do you need?</label>
                  <div className="text-3xl font-extrabold text-blue-600">
                    ₹{amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <input
                  type="range"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={5000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>₹{MIN_AMOUNT.toLocaleString("en-IN")}</span>
                  <span>₹2,50,000</span>
                  <span>₹{MAX_AMOUNT.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-bold">Preferred Repayment Tenure</label>
                  <div className="text-xl font-bold text-foreground">{tenure} Months</div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[6, 12, 18, 24].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setTenure(m)}
                      className={`py-3 rounded-xl font-semibold text-sm transition-all border ${
                        tenure === m
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                          : "bg-muted/40 border-border hover:bg-muted"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold">Purpose of Loan</label>
                <div className="flex flex-wrap gap-2">
                  {LOAN_PURPOSES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setFormData({ ...formData, purpose: p })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                        formData.purpose === p
                          ? "bg-blue-500/10 text-blue-600 border-blue-500"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated Monthly Installment (EMI)</p>
                  <p className="text-3xl font-black mt-1 text-foreground">
                    ₹{emi.toLocaleString("en-IN")}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                    <ShieldCheck className="w-4 h-4" /> Indicative Rate: 13.5% p.a.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Zero prepayment penalty after 1st EMI payment
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Continue to KYC & Bank
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Identity, Income & Bank Account */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">PAN Number</label>
                    {isPanVerified && (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={formData.pan}
                      onChange={(e) => {
                        setFormData({ ...formData, pan: e.target.value.toUpperCase() });
                        setIsPanVerified(false);
                      }}
                      className="flex-1 h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase font-mono"
                    />
                    <button
                      type="button"
                      disabled={isVerifyingPan || isPanVerified || formData.pan.length !== 10}
                      onClick={handleVerifyPan}
                      className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold disabled:opacity-50 transition-colors"
                    >
                      {isVerifyingPan ? <Loader2 className="w-4 h-4 animate-spin" /> : isPanVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Full Legal Name (as on PAN)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full legal name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">12-Digit Aadhaar Number</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="12-digit Aadhaar number"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Monthly Net Income (₹)</label>
                  <input
                    type="number"
                    required
                    min={5000}
                    placeholder="e.g. 45000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Bank Account Section */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-blue-600" />
                    Disbursement Bank Account
                  </h3>
                  {isBankVerified && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Account Verified via Penny Drop
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Bank Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HDFC Bank"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">Account Number</label>
                    <input
                      type="text"
                      required
                      placeholder="9 to 18 digits"
                      value={formData.accountNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, accountNumber: e.target.value });
                        setIsBankVerified(false);
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold">IFSC Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="HDFC0001234"
                        value={formData.ifsc}
                        onChange={(e) => {
                          setFormData({ ...formData, ifsc: e.target.value.toUpperCase() });
                          setIsBankVerified(false);
                        }}
                        className="flex-1 h-11 px-4 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase font-mono"
                      />
                      <button
                        type="button"
                        disabled={isVerifyingBank || isBankVerified || formData.accountNumber.length < 9}
                        onClick={handleVerifyBank}
                        className="px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-bold disabled:opacity-50 transition-colors"
                      >
                        {isVerifyingBank ? <Loader2 className="w-4 h-4 animate-spin" /> : isBankVerified ? "Verified" : "Verify"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Supporting Proofs (Optional for instant check, fast-tracks approval)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="p-4 rounded-xl border border-dashed border-border hover:border-blue-500 cursor-pointer text-xs flex items-center justify-between transition-colors bg-muted/20">
                    <div>
                      <p className="font-semibold">{docs.panFile ? docs.panFile.name : "Upload PAN Card Proof"}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">JPG, PNG or PDF (up to 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        setDocs((prev) => ({ ...prev, panFile: e.target.files?.[0] || null }))
                      }
                    />
                    <FileCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                  </label>
                  <label className="p-4 rounded-xl border border-dashed border-border hover:border-blue-500 cursor-pointer text-xs flex items-center justify-between transition-colors bg-muted/20">
                    <div>
                      <p className="font-semibold">{docs.bankFile ? docs.bankFile.name : "Upload Bank Statement / Salary"}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Last 3 months statement (PDF)</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) =>
                        setDocs((prev) => ({ ...prev, bankFile: e.target.files?.[0] || null }))
                      }
                    />
                    <FileCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Review Application
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Final Submission */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-4">
                <h3 className="font-bold text-lg border-b border-border pb-3">
                  Application Summary & Consent
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Requested Amount</p>
                    <p className="font-bold text-base">₹{amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Tenure</p>
                    <p className="font-bold text-base">{tenure} Months</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Indicative EMI</p>
                    <p className="font-bold text-base text-blue-600">₹{emi.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Applicant Name</p>
                    <p className="font-semibold">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">PAN Number</p>
                    <p className="font-semibold font-mono">{formData.pan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Disbursement Bank</p>
                    <p className="font-semibold">
                      {formData.bankName} (••{formData.accountNumber.slice(-4)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  By clicking Submit Application, you provide statutory consent for Aapka Credit and its partner NBFCs to verify your identity via UIDAI/NSDL and pull your credit bureau report from CIBIL/Experian in accordance with the RBI Digital Lending Guidelines.
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-semibold flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Details
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting for Underwriting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
