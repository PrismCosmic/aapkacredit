"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileSignature,
  Landmark,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ArrowRight,
  XCircle,
  Download,
  Zap,
  Sparkles,
  FileText,
  CreditCard,
  Check,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";

interface LoanStatusData {
  id: string;
  status: string;
  requested_amount?: number;
  approved_amount?: number;
  tenure_months?: number;
  interest_rate?: number;
  monthly_emi?: number;
  utr_number?: string;
  disbursed_at?: string;
  bank_account_number_masked?: string;
  bank_name?: string;
  ifsc_code?: string;
}

const ORDERED_STEPS = [
  "OTP_VERIFIED",
  "KYC_AADHAAR_DONE",
  "KYC_PAN_DONE",
  "BANK_VERIFIED",
  "BUREAU_CHECKED",
  "SUBMITTED",
  "UNDERWRITING_REVIEW",
  "OFFER_GENERATED",
  "OFFER_ACCEPTED",
  "KFS_ACCEPTED",
  "ESIGN_COMPLETED",
  "FEE_PAID",
  "APPROVED_PENDING_DISBURSEMENT",
  "DISBURSED",
  "ACTIVE",
];

function stepRank(step: string) {
  const idx = ORDERED_STEPS.indexOf((step || "").toUpperCase());
  return idx === -1 ? 0 : idx;
}

export default function ApplicationStatusPage() {
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [loan, setLoan] = useState<LoanStatusData | null>(null);
  const [offer, setOffer] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [kfsConsent, setKfsConsent] = useState(true);
  const [esignOtp, setEsignOtp] = useState("123456");

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams(window.location.search);
      let targetId = params.get("loan_id") || "";

      const [meRes, loansRes] = await Promise.all([
        fetch("/api/portal/users/me"),
        fetch("/api/portal/loans"),
      ]);
      const meJson = await meRes.json().catch(() => ({}));
      if (meRes.ok && meJson?.data) setUser(meJson.data);

      const loansJson = await loansRes.json().catch(() => ({}));
      const list: any[] = loansJson?.data?.loans || loansJson?.data || [];

      if (!targetId && list.length > 0) {
        targetId = list[0].id;
      }

      if (!targetId) {
        setLoan(null);
        setLoading(false);
        return;
      }

      const detailRes = await fetch(`/api/portal/loans/${encodeURIComponent(targetId)}`);
      const detailJson = await detailRes.json().catch(() => ({}));
      if (!detailRes.ok || detailJson?.success === false) {
        throw new Error(detailJson?.message || "Unable to load loan application status.");
      }

      const loanData: LoanStatusData = detailJson.data;
      setLoan(loanData);

      const rank = stepRank(loanData.status);
      if (rank >= stepRank("OFFER_GENERATED")) {
        const offerRes = await fetch(`/api/portal/loans/${encodeURIComponent(targetId)}/offer`);
        const offerJson = await offerRes.json().catch(() => ({}));
        if (offerRes.ok && offerJson?.data) {
          setOffer(offerJson.data);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch application status.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleAction = async (endpoint: string, successMsg: string) => {
    if (!loan) return;
    setActionBusy(true);
    try {
      const res = await fetch(`/api/portal/loans/${encodeURIComponent(loan.id)}/${endpoint}`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Action failed. Please try again.");
      } else {
        toast.success(successMsg);
        await loadStatus();
      }
    } catch {
      toast.error("Network error while updating application.");
    } finally {
      setActionBusy(false);
    }
  };

  const handleDisburse = async () => {
    if (!loan) return;
    setActionBusy(true);
    try {
      const res = await fetch(`/api/portal/loans/${encodeURIComponent(loan.id)}/disburse`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        toast.error(json?.message || "Disbursement failed. Please retry or contact support.");
      } else {
        toast.success("🎉 Payout processed! Loan amount disbursed to your bank account.");
        await loadStatus();
      }
    } catch {
      toast.error("Network error while processing disbursement.");
    } finally {
      setActionBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Connecting to AapkaCredit secure services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl bg-card border border-border p-10 text-center space-y-4">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto" />
        <h1 className="text-2xl font-bold">No Loan Application Found</h1>
        <p className="text-sm text-muted-foreground">
          You have not submitted a loan application yet. Apply in minutes to get an instant credit decision.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const upperStatus = (loan.status || "").toUpperCase();
  const rank = stepRank(upperStatus);
  const isRejected = ["REJECTED", "CANCELLED", "COOLING_OFF_CANCELLED"].includes(upperStatus);

  const stages = [
    {
      title: "KYC & Bank Verification",
      desc: "PAN, Aadhaar & Bank Account verified.",
      done: rank >= stepRank("BANK_VERIFIED"),
      icon: ShieldCheck,
    },
    {
      title: "Credit Bureau & Underwriting",
      desc: "Credit assessment & eligibility calculation.",
      done: rank >= stepRank("OFFER_GENERATED"),
      icon: Clock,
    },
    {
      title: "Offer & KFS Acceptance",
      desc: "Review sanctioned terms & RBI Key Fact Statement.",
      done: rank >= stepRank("KFS_ACCEPTED"),
      icon: CheckCircle2,
    },
    {
      title: "Digital e-Sign & Fee Verification",
      desc: "Aadhaar e-Sign agreement & one-time fee check.",
      done: rank >= stepRank("FEE_PAID") || rank >= stepRank("APPROVED_PENDING_DISBURSEMENT"),
      icon: FileSignature,
    },
    {
      title: "Instant Bank Disbursement",
      desc: "Direct IMPS/NEFT transfer to your bank account.",
      done: rank >= stepRank("DISBURSED"),
      icon: Landmark,
    },
  ];

  const sanctioned = Number(loan.approved_amount || offer?.approved_amount || loan.requested_amount || 50000);
  const tenure = Number(loan.tenure_months || offer?.tenure_months || 12);
  const annualRate = Number(loan.interest_rate || offer?.interest_rate || 13.5);
  const monthlyRate = annualRate / 12 / 100;
  const emi = Math.round(
    (sanctioned * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
  );
  const processingFee = Math.round(Math.max(999, sanctioned * 0.025) * 1.18);
  const netDisbursed = Math.max(0, sanctioned - processingFee);
  const apr = (annualRate + 2.8).toFixed(2);
  const totalRepayable = emi * tenure;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold ${
            isRejected
              ? "bg-rose-500/10 text-rose-600"
              : rank >= stepRank("DISBURSED")
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-blue-500/10 text-blue-600"
          }`}
        >
          {isRejected ? <XCircle className="w-4 h-4" /> : rank >= stepRank("DISBURSED") ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {upperStatus.replace(/_/g, " ")}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Application #{loan.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="text-sm text-muted-foreground">
          Requested: ₹{Number(loan.requested_amount || sanctioned).toLocaleString("en-IN")}
          {loan.approved_amount ? ` • Sanctioned: ₹${Number(loan.approved_amount).toLocaleString("en-IN")}` : ""}
        </p>
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold">Application Journey Tracker</h2>
          <span className="text-xs font-mono text-muted-foreground">
            Stage {Math.min(5, Math.max(1, stages.filter((s) => s.done).length + (rank >= stepRank("DISBURSED") ? 0 : 1)))} of 5
          </span>
        </div>

        {/* Stepper Progress */}
        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {stages.map((st) => (
            <div key={st.title} className="flex items-start gap-4 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-card transition-all ${
                  st.done
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <st.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className={`font-bold text-sm ${st.done ? "text-foreground" : "text-muted-foreground"}`}>
                  {st.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Blocks based on Current Loan Step */}
        {!isRejected && (
          <div className="pt-6 border-t border-border">
            {/* STAGE 1: Offer Ready & KFS Acceptance */}
            {(upperStatus === "OFFER_GENERATED" || upperStatus === "OFFER_ACCEPTED") && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3" /> Pre-Approved Offer
                    </span>
                    <h3 className="text-xl font-bold">RBI Key Fact Statement (KFS)</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Statutory disclosure format mandated by RBI Digital Lending Guidelines.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Sanctioned Amount</p>
                    <p className="text-2xl font-black text-blue-600">₹{sanctioned.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                {/* KFS Disclosure Table */}
                <div className="rounded-xl border border-border bg-card/80 overflow-hidden divide-y divide-border text-xs">
                  <div className="p-3 flex justify-between">
                    <span className="text-muted-foreground font-medium">1. Sanctioned Principal Loan Amount</span>
                    <span className="font-bold">₹{sanctioned.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-3 flex justify-between bg-muted/20">
                    <span className="text-muted-foreground font-medium">2. Upfront Processing Fee (2.5% + 18% GST)</span>
                    <span className="font-bold text-amber-600">₹{processingFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-3 flex justify-between font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <span>3. Net Disbursable Amount (Transferred to Bank)</span>
                    <span>₹{netDisbursed.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-muted-foreground font-medium">4. Annual Interest Rate (Fixed Reducing Balance)</span>
                    <span className="font-bold">{annualRate}% p.a.</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-muted-foreground font-medium">5. Annual Percentage Rate (APR)</span>
                    <span className="font-bold">{apr}% p.a.</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-muted-foreground font-medium">6. Loan Tenure & Monthly EMI</span>
                    <span className="font-bold">{tenure} Months • ₹{emi.toLocaleString("en-IN")}/mo</span>
                  </div>
                  <div className="p-3 flex justify-between">
                    <span className="text-muted-foreground font-medium">7. Total Amount Payable over {tenure} Months</span>
                    <span className="font-bold">₹{totalRepayable.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-3 flex justify-between bg-blue-500/10 text-blue-700 dark:text-blue-300">
                    <span className="font-medium">8. Statutory Cooling-Off Look-up Period</span>
                    <span className="font-bold">3 Calendar Days (Zero Exit Fee)</span>
                  </div>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    checked={kfsConsent}
                    onChange={(e) => setKfsConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 mt-0.5 accent-blue-600"
                  />
                  <span className="text-muted-foreground leading-relaxed">
                    I confirm that I have reviewed the Key Fact Statement, APR, and repayment obligations. I accept the loan sanction offer and proceed to digital e-Sign.
                  </span>
                </label>

                <button
                  type="button"
                  disabled={!kfsConsent || actionBusy}
                  onClick={async () => {
                    await handleAction("accept", "Loan offer accepted!");
                    await handleAction("kfs/accept", "Key Fact Statement accepted!");
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {actionBusy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Recording Acceptance...
                    </>
                  ) : (
                    <>
                      Accept KFS & Proceed to Digital e-Sign <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STAGE 2: Digital e-Sign Agreement */}
            {upperStatus === "KFS_ACCEPTED" && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FileSignature className="w-5 h-5 text-indigo-600" />
                      Digital Loan Agreement e-Sign
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      RBI Information Technology Act (IT Act 2000) compliant Aadhaar e-Sign execution.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-indigo-500/10 text-indigo-600 rounded-md font-semibold">
                    AGR-{loan.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Borrower:</span>
                    <span className="font-semibold">{user?.full_name || "Authorized Applicant"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Lender Entity:</span>
                    <span className="font-semibold">AapkaCredit NBFC Partner</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sanctioned Facility:</span>
                    <span className="font-semibold">₹{sanctioned.toLocaleString("en-IN")} Personal Loan</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold">Enter Aadhaar OTP for Signature</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={esignOtp}
                      onChange={(e) => setEsignOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 h-11 px-4 rounded-xl border border-input bg-card font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      disabled={actionBusy || esignOtp.length < 6}
                      onClick={() => handleAction("esign", "Digital e-Sign executed successfully!")}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 flex items-center gap-2 shadow-md shadow-indigo-500/20"
                    >
                      {actionBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      e-Sign Agreement
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    OTP simulation active for sandbox testing. Enter 123456 or any 6 digits to verify.
                  </p>
                </div>
              </div>
            )}

            {/* STAGE 3: Processing Fee Payment */}
            {upperStatus === "ESIGN_COMPLETED" && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                      One-Time Processing Fee
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Covers credit bureau pull, documentation, and NACH e-mandate registration.
                    </p>
                  </div>
                  <span className="text-xl font-bold">₹{processingFee.toLocaleString("en-IN")}</span>
                </div>

                <div className="pt-2">
                  <RazorpayCheckoutButton
                    amount={processingFee}
                    loanId={loan.id}
                    paymentType="fee"
                    purpose={`Processing Fee - Loan #${loan.id.slice(0, 8).toUpperCase()}`}
                    userDetails={{
                      name: user?.full_name || undefined,
                      email: user?.email || undefined,
                      contact: user?.mobile_number || undefined,
                    }}
                    buttonText={`Pay Processing Fee (₹${processingFee.toLocaleString("en-IN")}) via UPI / Cards`}
                    onSuccess={() => loadStatus()}
                  />
                </div>
              </div>
            )}

            {/* STAGE 4: Ready for Instant Disbursement (Previously Missing on Web!) */}
            {(upperStatus === "FEE_PAID" || upperStatus === "APPROVED_PENDING_DISBURSEMENT") && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 border-2 border-emerald-500/30 space-y-5 animate-in zoom-in-95 duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                      <Zap className="w-3.5 h-3.5" /> All Checks Passed
                    </span>
                    <h3 className="text-2xl font-black text-foreground">Ready for Instant Bank Transfer!</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your loan agreement is fully executed. Tap below to trigger instant IMPS transfer to your verified bank account.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Net Payout</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ₹{netDisbursed.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="p-4 rounded-xl bg-card border border-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Beneficiary Bank</span>
                    <p className="font-bold mt-0.5">{loan.bank_name || user?.bank_name || "HDFC Bank"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Number</span>
                    <p className="font-bold font-mono mt-0.5">
                      ••{String(loan.bank_account_number_masked || user?.bank_account || "9876").slice(-4)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Transfer Mode</span>
                    <p className="font-bold text-blue-600 mt-0.5">24x7 IMPS Instant Payout</p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={actionBusy}
                  onClick={handleDisburse}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50"
                >
                  {actionBusy ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Initiating IMPS Transfer...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Disburse ₹{netDisbursed.toLocaleString("en-IN")} to My Bank Account Now
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STAGE 5: Loan Disbursed / Active Success Receipt */}
            {(upperStatus === "DISBURSED" || upperStatus === "ACTIVE") && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                        Loan Successfully Disbursed!
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Transferred via IMPS to your verified bank account.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Disbursed Principal</span>
                    <p className="font-bold text-sm mt-0.5">₹{sanctioned.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bank Reference (UTR)</span>
                    <p className="font-mono font-bold text-sm mt-0.5 text-blue-600 truncate">
                      {loan.utr_number || `IMPS${loan.id.slice(0, 8).toUpperCase()}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly EMI</span>
                    <p className="font-bold text-sm mt-0.5">₹{emi.toLocaleString("en-IN")}/mo</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tenure</span>
                    <p className="font-bold text-sm mt-0.5">{tenure} Months</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/loans`}
                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-500/20"
                  >
                    <Layers className="w-4 h-4" />
                    View Repayment Schedule & Pay EMI
                  </Link>
                  <a
                    href={`/api/portal/loans/${encodeURIComponent(loan.id)}/documents/sanction`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-xl border border-border hover:bg-muted font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                    Download Sanction Letter (PDF)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-center gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 font-semibold text-sm transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/loans"
          className="px-6 py-3 rounded-xl border border-border hover:bg-muted font-semibold text-sm transition-colors"
        >
          View All Loans
        </Link>
      </div>
    </div>
  );
}
